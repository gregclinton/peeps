chat = {
    messages: [],
    peep: peeps.register('Max', 'You are a helpful assistant.'),

    prompt: async text => {
        chat.waiting = true;

        {
            const name = text.split(',')[0];
            const p = peeps[name];

            if (p) {
                chat.peep = p;
            }
        }

        const peep = chat.peep;

        function post(name, text) {
            const title = document.createElement('span');

            title.innerHTML = name === 'me' ? name : peep.name;
            title.classList.add('name');

            const top = document.createElement('div');

            top.append(title);

            if (name !== 'me') {
                const span = text => {
                    const span = document.createElement('span');
                    span.innerHTML = text;
                    span.classList.add('settings')
                    return span;
                };

                top.append(span(settings.model), span(settings.temperature));
            }

            const bottom = document.createElement('div');
            bottom.innerHTML = text;

            const post = document.createElement('div');
            post.append(top, bottom);
            post.classList.add('post');
            document.getElementById('chat').appendChild(post);

            post.scrollIntoView({ behavior: 'smooth' });
        }

        post('me', text);

        if (peep.handler && peep.name === text.split(',')[0]) {
            // blot out the agent's name, so as not to confuse him
            text = text.charAt(peep.name.length + 2).toUpperCase() + text.slice(peep.name.length + 3);
        }

        chat.messages.push({ prompt: text });

        function addResponse(response) {
            if (peep.voice !== 'none') {
                player.tts(response, peep.voice);
            }
            chat.messages.push({ response: response });
            response = response.replace(/\\/g, '\\\\');  // so markdown won't trample LaTex
            response = marked.parse(response);
            post('', response);
            MathJax.typesetPromise();
            chat.waiting = false;
        }

        const instructions =
            peep.handler ? ('Respond with JSON.\n' + peep.instructions + '\nProvide key "reply" telling what you did in a lighthearted way.') :
            (peep.instructions + ' Keep your answers brief. ' +
            'If there is any math, render it using LaTeX math mode with the equation environment and \\( and \\) where inline is needed.');

        const headers = { 'Content-Type': 'application/json' };

        switch (peep.handler ? 'gpt' : settings.model) {
            case 'gpt': {
                // https://platform.openai.com/docs/api-reference/introduction

                const msgs = chat.messages.map(msg => msg.prompt ? { role: 'user', content: msg.prompt } : { role: 'assistant', content: msg.response });

                msgs.unshift({ role: 'system', content: instructions });

                await fetch('/openai/v1/chat/completions', {
                    method: 'POST',
                    headers:  headers,
                    body: JSON.stringify({
                        messages: msgs,
                        model: 'gpt-4-turbo-2024-04-09',
                        temperature: peep.handler ? 0 : 2.0 * settings.temperature / 100.0,
                        response_format: { type: peep.handler ? 'json_object' : 'text' }
                    })
                })
                .then(response => response.json())
                .then(o => {
                    const content = o.choices[0].message.content;

                    if (peep.handler) {
                        const o = JSON.parse(content);

                        peep.handler(o);
                        addResponse(o.reply || 'Done.');
                    } else {
                        addResponse(content);
                    }
                });
                break;
            }

            case 'claude': {
                // https://docs.anthropic.com/claude/reference/messages_post

                const msgs = chat.messages.map(msg => msg.prompt ? { role: 'user', content: msg.prompt } : { role: 'assistant', content: msg.response });
                headers['anthropic-version'] = '2023-06-01';

                await fetch('/anthropic/v1/messages', {
                    method: 'POST',
                    headers:  headers,
                    body: JSON.stringify({
                        system: instructions,
                        messages: msgs,
                        model: 'claude-3-opus-20240229',
                        temperature: 1.0 * settings.temperature / 100.0,
                        max_tokens: 1000
                    })
                })
                .then(response => response.json())
                .then(o => addResponse(o.content[0].text));
                break;
            }

            case 'gemini': {
                // https://ai.google.dev/api/rest
                // https://ai.google.dev/tutorials/rest_quickstart

                const text = instructions + chat.messages.map(msg => msg.prompt ? 'prompt: ' +  msg.prompt : 'response: ' + msg.response).join('\n') + '\nresponse: ';

                await fetch('/gemini/v1beta/models/gemini-pro:generateContent', {
                    method: 'POST',
                    headers:  headers,
                    body: JSON.stringify({ contents: [{parts: [{text: text}]}]})
                })
                .then(response => response.json())
                .then(o => addResponse(o.candidates[0].content.parts[0].text));
                break;
            }

            case 'mistral': {
                // https://docs.mistral.ai/api/

                const msgs = chat.messages.map(msg => msg.prompt ? { role: 'user', content: msg.prompt } : { role: 'assistant', content: msg.response });

                await fetch('/mistral/v1/chat/completions', {
                    method: 'POST',
                    headers:  headers,
                    body: JSON.stringify({
                        messages: msgs,
                        model: 'mistral-large-latest'
                    })
                })
                .then(response => response.json())
                .then(o => addResponse(o.choices[0].message.content));
                break;
            }
        }
    },

    clear: () => {
        document.getElementById('chat').innerHTML = "";
        chat.messages = [];
    },

    paste: () => {
        navigator.clipboard.readText()
        .then(text => {
            if (text !== '') {
                chat.prompt(text);
            }
        })
    },

    redo: () => {
        const m = chat.messages;

        if (m.length > 1) {
            const text = m[m.length - 2].prompt;
            const div = document.getElementById('chat');

            div.removeChild(div.lastChild);
            div.removeChild(div.lastChild);
            m.pop();
            m.pop();

            chat.prompt(text);
        }
    },

    back: () => {
        const m = chat.messages;

        if (m.length > 1) {
            const div = document.getElementById('chat');

            div.removeChild(div.lastChild);
            div.removeChild(div.lastChild);
            m.pop();
            m.pop();

            if (m.length > 1) {
                chat.peep = peeps[div.lastChild.querySelector('.name').innerHTML];
            }
        }
    }
}