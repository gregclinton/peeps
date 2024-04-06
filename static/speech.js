const speech = {
    stt: blob => {
        const data = new FormData();

        data.append("file", blob, 'audio/stt.wav');

        return fetch('/stt/', {
            method: 'PUT',
            body: data,
        })
    },

    start: () => {
        document.getElementById('speech-start').hidden = true;
        document.getElementById('speech-send').hidden = false;
        document.getElementById('speech-stop').hidden = false;

        recorder.start();
    },

    send: () => {
        document.getElementById('speech-send').hidden = true;
        recorder.stop(() => {
            speech.stt(recorder.blob())
            .then(res => res.text())
            .then(prompt => {
                chat.add('you', prompt);
                chat.prompt(prompt)
                .then(response => {
                    response = response.replace(/\\/g, '\\\\');  // so markdown won't trample LaTex
                    chat.add(settings.model, marked.parse(response));
                    MathJax.typesetPromise();
                    document.getElementById('speech-start').hidden = false;
                    document.getElementById('speech-stop').hidden = true;
                })
            })
        })
    },

    stop: () => {
        document.getElementById('speech-send').hidden = true;
        document.getElementById('speech-stop').hidden = true;
        document.getElementById('speech-start').hidden = false;
        recorder.stop();
    }
};