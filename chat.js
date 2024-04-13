chat = {
    messages: [],
    peep: peeps.register('Max', 'You are a helpful assistant. ', 'none'),

    prompt: async text => {
        chat.waiting = true;

        {
            const name = text.split(',')[0];
            const p = peeps[name];

            if (p) {
                chat.peep = p;
                chat.peep.name = name;
            }
        }

        const peep = chat.peep;

        function post(name, text) {
            const post = document.createElement('div');
            const top = document.createElement('div');
            const bottom = document.createElement('div');
            const n = document.createElement('h4');
            const h = document.createElement('div');
            const s = document.createElement('div');

            if (name !== 'me') {
                const span = text => {
                    const e = document.createElement('span');
                    e.innerHTML = text;
                    return e;
                };

                s.classList.add('settings');
                s.append(span(settings.model), span(settings.temperature));
            }

            top.append(n, s)
            post.append(top, bottom);

            n.innerHTML = name === 'me' ? name : peep.name;
            bottom.innerHTML = text;

            post.classList.add('post');
            document.getElementById('chat').appendChild(post);

            post.scrollIntoView({ behavior: 'smooth' });
        }

        post('me', text);

        if (peep.handler) {
            // blot out the agent's name, so as not to confuse him
            text = text.charAt(name.length + 2).toUpperCase() + text.slice(name.length + 3);
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

        const cmd = text.toLowerCase().split(/[,.\s]+/);

        if (['gpt', 'claude', 'gemini', 'mistral'].includes(cmd[0])) {
            settings.model = cmd[0];
            if (cmd.length > 1 && cmd[1] === 'redo' && chat.messages.length > 1) {
                chat.back();
            }
        }

        const instructions =
            peep.handler ? ('Respond with JSON.\n' + peep.instructions +
            '\nProvide key "reply" telling what you did in a lighthearted way.')
            :
            (peep.instructions +
            'Pretend your name is ' + peep.name + '. ' +
            'Never refer to yourself by name, unless directly asked your name. ' +
            'Never refer to yourself as an AI. This is role playing and you must remain in character. ' +
            'Keep your answers brief. ' +
            'If there is any math, render it using LaTeX math mode with the equation environment and \\( and \\) where inline is needed. ');

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
                        chat.messages.pop();
                        chat.messages.pop();
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

                const text = chat.messages.map(msg => msg.prompt ? 'prompt: ' +  msg.prompt : 'response: ' + msg.response).join('\n') + '\nresponse: ';

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

            chat.back();
            chat.prompt(text);
        }
    },

    back: () => {
        const m = chat.messages;

        if (m.length > 1) {
            const div = document.getElementById('chat');

            div.removeChild(div.lastElementChild);
            div.removeChild(div.lastElementChild);
            m.pop();
            m.pop();
        }
    }
}

document.addEventListener('paste', function() {
    navigator.clipboard.readText()
    .then(text => {
        document.getElementById('paste').disabled = text !== '';
    })
});