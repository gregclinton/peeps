settings = {
    toggle: () => {
        e = document.getElementById('settings');
        e.hidden = !e.hidden;
    },

    model: 'gpt-3.5-turbo-0125'
}

fetch('/settings/', {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({model: 'gpt-3.5-turbo-0125'})
})
