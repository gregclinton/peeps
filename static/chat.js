chat = {
    clear: () => {
        fetch('/chat/', {
            method: 'DELETE'
        })
    }
}