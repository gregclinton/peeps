const speech = {
    show: (name, show) => {
        document.getElementById('speech-' + name).hidden = !show;
    },

    stt: blob => {
        const data = new FormData();

        data.append("file", blob, 'audio/stt.wav');

        return fetch('/stt/', {
            method: 'PUT',
            body: data,
        })
    },

    start: () => {
        speech.show('start', false);
        speech.show('send', true);
        speech.show('stop', true);
        recorder.start();
    },

    send: () => {
        document.getElementById('speech-send').hidden = true;
        recorder.stop(() => {
            speech.stt(recorder.blob())
            .then(res => res.text())
            .then(prompt => {
                chat.prompt(prompt.trim())
                .then(() => {
                    speech.show('start', true);
                    speech.show('stop', false);
                })
            })
        })
    },

    stop: () => {
        speech.show('start', true);
        speech.show('send', false);
        speech.show('stop', false);
        recorder.stop();
    }
};