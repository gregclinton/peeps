settings = {
    toggle: () => {
        e = document.getElementById('settings');
        e.hidden = !e.hidden;
    },

    updateModel: (name) => {
        fetch('/settings/model/', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({model: name})
        })
    },

    updateVoice: (name) => {
        fetch('/settings/voice/', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({voice: name})
        })
    },

    selectedModel: null
}

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
        ['gpt-4-0125-preview', '10/30'],
        ['gpt-4', '10/60'],
        ['gpt-3.5-turbo-0125', '0.50/1.50'],
        ['claude-3-haiku-20240307' , '0.25/1.25'],
        ['claude-3-sonnet-20240229', '3/15'],
        ['claude-3-opus-20240229', '15/75'],
        ['gemini-1.0-pro-001', 'free'],
        ['mistral-small-latest' , '2/6'],
        ['mistral-medium-latest', '2.70/8.10'],
        ['mistral-large-latest', '8/24'],
    ].forEach(model => {
        const tr = document.createElement('tr');
        const addTd = (value => {
            const td = document.createElement('td');

            td.innerHTML = value;
            tr.appendChild(td)
        });

        const name = model[0];
        const price = model[1];

        addTd(name);
        addTd(price);

        if (name === 'gpt-3.5-turbo-0125') {
            tr.classList.add('selected')
            settings.selectedModel = tr;
            settings.updateModel(name);
        }

        tbody.appendChild(tr);

        tr.onclick = () => {
            settings.selectedModel.classList.remove('selected')
            tr.classList.add('selected');
            settings.selectedModel = tr;
            settings.updateModel(name);
        }
    });

    const voices = document.getElementById('voices');
    
    [
        'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'
    ].forEach(voice => {
        const span = document.createElement('span');

        span.innerHTML = voice;
        voices.appendChild(span);
   
        if (voice === 'alloy') {
            span.classList.add('selected')
            settings.selectedVoice = span;
            settings.updateVoice(voice);
        }

        div.appendChild(span);

        tr.onclick = () => {
            settings.selectedVoice.classList.remove('selected')
            span.classList.add('selected');
            settings.selectedVoice = span;
            settings.updateVoice(voice);
        }
    });
};