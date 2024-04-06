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
                chat.prompt(prompt)
                .then(() => {
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