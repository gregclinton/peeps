chat = {
    messages: [],

    prompt: async text => {
        chat.messages.push({prompt: text});

        return await fetch('/chat/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({messages: chat.messages, model: settings.model})
        })
        .then(res => res.text())
        .then(text => {
            chat.messages.push({response: text});
            return text;
        })
    },

    clear: () => {
        document.getElementById('chat').innerHTML = "";
        chat.messages = [];
    },

    add: (name, text) => {
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

    },

    redo: () => {

    },

    back: () => {
        const div = document.getElementById('chat');

        div.removeChild(div.lastElementChild);
        div.removeChild(div.lastElementChild);
        chat.messages.pop();
        chat.messages.pop();
    }
}

document.addEventListener('paste', function(event) {
    var pastedText = (event.clipboardData || window.clipboardData).getData('text');
    console.log('Pasted text: ', pastedText);
});