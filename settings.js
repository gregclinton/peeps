settings = {
    toggle: () => {
        e = document.getElementById('settings');
        e.hidden = !e.hidden;
    },

    model: '',
    temperature: null,
    selectedModel: null,
    selectedTemperature: null
}

window.onload = () => {
    chat.clear();
    document.getElementById('speech-send').hidden = true;
    document.getElementById('speech-stop').hidden = true;

    const models = document.getElementById('models');

    ['gpt', 'claude', 'gemini', 'mistral'].forEach(name => {
        const span = document.createElement('span');

        span.innerHTML = name;

        if (name === 'gpt') {
            span.classList.add('selected')
            settings.selectedModel = span;
            settings.model = name;
        }

        models.appendChild(span);

        span.onclick = () => {
            settings.selectedModel.classList.remove('selected');
            span.classList.add('selected');
            settings.selectedModel = span;
            settings.model = name;
        }
    });

    const temperature = document.getElementById('temperature');

    const addSpan = (text) => {
        const span = document.createElement('span');

        span.innerHTML = text;
        temperature.appendChild(span);
        return span;
    }

    addSpan('cold');
    for (let i = 0; i < 9; i++) {
        const span = addSpan('&nbsp;&nbsp;|&nbsp;&nbsp;');

        span.classList.add('tick');
        if (i === 4) {
            settings.temperature = i;
            span.classList.add('selected');
            settings.selectedTemperature = span;
        }

        span.onclick = () => {
            settings.selectedTemperature.classList.remove('selected')
            span.classList.add('selected');
            settings.selectedTemperature = span;
            settings.temperature = i;
        }
    }
    addSpan('hot');
};