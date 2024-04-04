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
    }
}