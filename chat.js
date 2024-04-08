chat = {
    messages: [],

    prompt: async text => {
        chat.add('you', text);
        let res;

        if (settings.model.startsWith('gpt')) {
            // https://platform.openai.com/docs/api-reference/introduction

            //   messages = [ {"role": "system", "content": "You are a helpful assistant. Keep your answers brief."} ];

            res = fetch('/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                } ,
                body: JSON.stringify({
                    messages: chat.messages.map(msg => msg.prompt ? {role: 'user', content: msg.prompt} : {role: 'assistant', content: msg.prompt}),
                    model: settings.model,
                    temperature: 2.0 * settings.temperature / 8.0
                })
            });
        } else if (settings.model.startsWith('claude')) {
            res = fetch('/anthropic/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                } ,
                body: JSON.stringify({
                    system: "You are a helpful assistant. Keep your answers brief.",
                    messages: chat.messages.map(msg => msg.prompt ? {role: 'user', content: msg.prompt} : {role: 'assistant', content: msg.prompt}),
                    model: settings.model,
                    temperature: 1.0 * settings.temperature / 8.0
                })
            });
        } else if (settings.model.startsWith('gemini')) {
            res = fetch('/gemini/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                } ,
                body: JSON.stringify({
                    messages: chat.messages.map(msg => msg.prompt ? {role: 'user', content: msg.prompt} : {role: 'assistant', content: msg.prompt}),
                    model: settings.model,
                    temperature: 2.0 * settings.temperature / 8.0
                })
            });
        } else if (settings.model.startsWith('mistral')) {
            res = fetch('/mistral/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                } ,
                body: JSON.stringify({
                    messages: chat.messages.map(msg => msg.prompt ? {role: 'user', content: msg.prompt} : {role: 'assistant', content: msg.prompt}),
                    model: settings.model,
                    temperature: 2.0 * settings.temperature / 8.0
                })
            });
        }

        res.then(res => res.text())
        .then(response => {
            response = response.replace(/\\/g, '\\\\');  // so markdown won't trample LaTex
            chat.add(settings.model, marked.parse(response));
            MathJax.typesetPromise();
        })
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