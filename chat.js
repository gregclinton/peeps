chat = {
    messages: [],

    prompt: async text => {
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

        chat.messages.push({ prompt: text });
        post('me', text);
        const instructions = "You are a helpful assistant. Keep your answers brief. If there is any math, render it in standard LaTex.";
        const headers = { 'Content-Type': 'application/json' };

        function addResponse(response) {
            chat.messages.push({ response: response });
            response = response.replace(/\\/g, '\\\\');  // so markdown won't trample LaTex
            post(settings.model, marked.parse(response));
            MathJax.typesetPromise();
        }

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
                        temperature: 2.0 * settings.temperature / 10.0
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

                const transcript = chat.messages.map(msg => msg.prompt ? 'prompt: ' +  msg.prompt : 'response: ' + msg.response).join('\n') + '\nresponse: ';

                await fetch('/gemini/v1beta/models/gemini-pro:generateContent', {
                    method: 'POST',
                    headers:  headers,
                    body: JSON.stringify({
                        transcript: transcript,
                        model: 'gemini-1.0-pro-001'
                    })
                })
                .then(response => response.json())
                .then(o => addResponse(o.text));
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
                .then(o => addResponse(o.content.text));
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