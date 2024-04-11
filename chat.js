chat = {
    messages: [],

    prompt: async text => {
        let name = false;
        let isAgent = false;
        let voice = settings.voice;

        function post(name, text) {
            const post = document.createElement('div');
            const n = document.createElement('h4');
            const t = document.createElement('div');

            post.appendChild(n);
            post.appendChild(t);

            n.innerHTML = name;
            t.innerHTML = text;

            post.classList.add('post');
            document.getElementById('chat').appendChild(post);

            post.scrollIntoView({ behavior: 'smooth' });
        }

        post('me', text);

        name = text.split(',')[0];
        isAgent = name in agents;

        if (name in peeps) {
            chat.name = name;
        }

        chat.messages.push({ prompt: text });

        function addResponse(response) {
            if (voice !== 'none') {
                speech.tts(response, voice);
            } else {
                speech.show('start');
            }
            chat.messages.push({ response: response });

            if (!isAgent) {
                response = response.replace(/\\/g, '\\\\');  // so markdown won't trample LaTex
                response = marked.parse(response);
            }
            post(name || settings.model, response);
            MathJax.typesetPromise();
        }

        if (isAgent) {
            await agents.prompt(name, text)
            .then(response => addResponse(response))
            return;
        } else if (['gpt', 'claude', 'gemini', 'mistral'].includes(name.toLowerCase())) {
            settings.model = name.toLowerCase();
        } else if (chat.name) {
            name = chat.name;
        } else {
            chat.name = name;
        }

        const peep = peeps[name];

        if (peep) {
            voice = peep.voice || 'none';
        } else {
            name = settings.model;
            voice = settings.voice;
        }

        const instructions =
            (peep ?  ('Pretend your name is ' + name + '. ' +
                    'Never refer to yourself by name, unless directly asked your name. ' +
                    'Never refer to yourself as an AI. This is role playing and you must remain in character. ')
                    : 'You are a helpful assistant. ') +
            'Keep your answers brief. ' +
            'If there is any math, render it using LaTeX math mode with the equation environment and \\( and \\) where inline is needed. ';

        const headers = { 'Content-Type': 'application/json' };

        switch (settings.model) {
            case 'gpt': {
                // https://platform.openai.com/docs/api-reference/introduction

                const msgs = chat.messages.map(msg => msg.prompt ? { role: 'user', content: msg.prompt } : { role: 'assistant', content: msg.response });

                msgs.unshift({ role: 'system', content: instructions });

                await fetch('/openai/v1/chat/completions', {
                    method: 'POST',
                    headers:  headers,
                    body: JSON.stringify({
                        messages: msgs,
                        model: 'gpt-4-0125-preview',
                        temperature: 2.0 * settings.temperature / 10.0,
                    })
                })
                .then(response => response.json())
                .then(o => addResponse(o.choices[0].message.content));
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
                        temperature: 1.0 * settings.temperature / 10.0,
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
        chat.name = '';
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