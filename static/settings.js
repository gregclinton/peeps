settings = {
    toggle: () => {
        e = document.getElementById('settings');
        e.hidden = !e.hidden;
    },

    model: '',
    voice: '',
    selectedModel: null
}

window.onload = () => {
    chat.clear();
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
            settings.model = name;
        }

        tbody.appendChild(tr);

        tr.onclick = () => {
            settings.selectedModel.classList.remove('selected')
            tr.classList.add('selected');
            settings.selectedModel = tr;
            settings.model = name;
        }
    });

    const voices = document.getElementById('voices');

    [
        'none', 'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'
    ].forEach(voice => {
        const span = document.createElement('span');

        span.innerHTML = voice + ' &nbsp;&nbsp;&nbsp;';
        voices.appendChild(span);

        if (voice === 'none') {
            span.classList.add('selected')
            settings.selectedVoice = span;
            settings.voice = voice;
        }

        span.onclick = () => {
            settings.selectedVoice.classList.remove('selected')
            span.classList.add('selected');
            settings.selectedVoice = span;
            settings.voice = voice;
        }
    });
};