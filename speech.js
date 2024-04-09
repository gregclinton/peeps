const speech = {
    hide: (name, show) => {
        document.getElementById('speech-' + name).hidden = show === undefined;
    },

    show: (name) => { speech.hide(name, false); },

    stt: blob => {
        const data = new FormData();

        data.append('file', blob, 'stt.wav');
        data.append('model', 'whisper-1'); // 100 seconds for a penny
        data.append('language', 'en'); // optional but improves accuracy and latency
        data.append('response_format', 'text');

        return fetch('/openai/v1/audio/transcriptions', {
            method: 'POST',
            body: data
        })
    },

    start: () => {
        speech.hide('start');
        speech.show('send');
        speech.show('stop');
        recorder.start();
    },

    send: () => {
        speech.hide('send');
        recorder.stop(() => {
            speech.stt(recorder.blob())
            .then(res => res.text())
            .then(prompt => {
                chat.prompt(prompt.trim())
                .then(() => {
                    speech.show('start');
                    speech.hide('stop');
                })
            })
        })
    },

    stop: () => {
        speech.show('start');
        speech.hide('send');
        speech.hide('stop');
        recorder.stop();
    }
};