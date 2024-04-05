chat = {
    prompt: text => {
        return fetch('/chat/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({text: text})
        })
    },

    clear: () => {
        fetch('/chat/', {
            method: 'DELETE'
        })

        document.getElementById('chat').innerHTML = "";
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
    }
}