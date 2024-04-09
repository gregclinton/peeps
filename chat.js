chat = {
    messages: [],

    prompt: async text => {
        chat.add('me', text);
        let res;
        const instruction = "You are a helpful assistant. Keep your answers brief.";
        const headers = { 'Content-Type': 'application/json' };

        function add(response) {
            response = response.replace(/\\/g, '\\\\');  // so markdown won't trample LaTex
            chat.add(settings.model, marked.parse(response));
            MathJax.typesetPromise();
        }

        let msgs;

        switch (settings.model) {
            case 'gpt':
            // https://platform.openai.com/docs/api-reference/introduction

            msgs = chat.messages.map(msg => msg.prompt ? { role: 'user', content: msg.prompt } : { role: 'assistant', content: msg.response });

            fetch('/openai/v1/chat/completions', {
                method: 'POST',
                headers:  headers,
                body: JSON.stringify({
                    messages: msgs,
                    model: 'gpt-4-0125-preview',
                    temperature: 2.0 * settings.temperature / 8.0
                })
            })
            .then(response => response.json())
            .then(o => add(o.choices[0].message.content));
            break;

        case 'claude':
            // https://docs.anthropic.com/claude/reference/messages_post

            msgs = chat.messages.map(msg => msg.prompt ? { role: 'user', content: msg.prompt } : { role: 'assistant', content: msg.response });
            headers['anthropic-version'] = '2023-06-01';

            fetch('/anthropic/v1/messages', {
                method: 'POST',
                headers:  headers,
                body: JSON.stringify({
                    system: instruction,
                    messages: msgs,
                    model: 'claude-3-opus-20240229',
                    temperature: 1.0 * settings.temperature / 8.0,
                    max_tokens: 1000
                })
            })
            .then(response => response.json())
            .then(o => add(o.content[0].text));
            break;

        case 'gemini':
            // https://ai.google.dev/api/rest
            // https://ai.google.dev/tutorials/rest_quickstart

            const transcript = chat.messages.map(msg => msg.prompt ? 'prompt: ' +  msg.prompt : 'response: ' + msg.response).join('\n') + '\nresponse: ';

            fetch('/gemini/v1beta/models/gemini-pro:generateContent', {
                method: 'POST',
                headers:  headers,
                body: JSON.stringify({
                    transcript: transcript,
                    model: 'gemini-1.0-pro-001'
                })
            })
            .then(response => response.json())
            .then(o => add(o.text));
            break;

        case 'mistral':
            // https://docs.mistral.ai/api/

            msgs = chat.messages.map(msg => msg.prompt ? { role: 'user', content: msg.prompt } : { role: 'assistant', content: msg.response });

            fetch('/mistral/v1/chat/completions', {
                method: 'POST',
                headers:  headers,
                body: JSON.stringify({
                    messages: msgs,
                    model: 'mistral-large-latest'
                })
            })
            .then(response => response.json())
            .then(o => add(o.content.text));
            break;
        }
    },

    clear: () => {
        document.getElementById('chat').innerHTML = "";
        chat.messages = [];
    },

    add: (name, text) => {
        chat.messages.push({[name === 'you' ? 'prompt' : 'response']: text});
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

document.addEventListener('paste', function(event) {
    navigator.clipboard.readText()
    .then(text => {
        document.getElementById('paste').disabled = text !== '';
    })
});