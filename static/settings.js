settings = {
    toggle: () => {
        e = document.getElementById('settings');
        e.hidden = !e.hidden;
    },

    name: 'gpt-3.5-turbo-0125',
}

fetch('/settings/', {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({model: 'gpt-3.5-turbo-0125'})
})

window.onload = () => {
    document.getElementById('speech-send').hidden = true;
    document.getElementById('speech-stop').hidden = true;

    const models = document.getElementById('models');
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    const thead = document.createElement('thead');

    thead.innerHTML = '<th>model</th><th>price</th>';
    table.appendChild(thead);
    table.appendChild(tbody);
    models.appendChild(table);

    [
        ['gpt-4-0125-preview', '$10/$30'],
        ['gpt-4', '$10/$60'],
        ['gpt-3.5-turbo-0125', '$0.50/$1.50'],
        ['claude-3-haiku-20240307' , '$0.25/$1.25'],
        ['claude-3-sonnet-20240229', '$3/$15'],
        ['claude-3-opus-20240229', '$15/$75'],
        ['gemini-1.0-pro-001', 'free'],
        ['gemini-1.5-pro-latest', 'free'],
        ['gemini-nano', '$0.13/$0.38'],
        ['mistral-small-latest' , '$2/$6'],
        ['mistral-medium-latest', '$2.70/$8.10'],
        ['mistral-large-latest', '$8/24'],
    ].forEach(model => {
        const tr = document.createElement('tr');
        const addTd = (value => {
            if (value !== null) {
                const td = document.createElement('td');

                td.innerHTML = value;
                tr.appendChild(td)
            }
        });

        addTd(model[0]);
        addTd(model[1]);
        tbody.appendChild(tr);

        tr.onclick = () => {
            settings.name = model.name;
        }
    });
};