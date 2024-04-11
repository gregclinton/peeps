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

    tts: async (text, voice) => {
        speech.show('stop');
        fetch('/openai/v1/audio/speech', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                model: "tts-1",
                voice: voice,
                input: text
            })
        })
        .then(res => res.blob())
        .then(blob => { player.play(blob, () => {
            speech.show('start');
            speech.hide('stop');
        })});
    },

    start: () => {
        speech.hide('start');
        speech.show('send');
        speech.show('stop');
        recorder.start();
    },

    send: () => {
        speech.hide('send');
        speech.hide('stop');
        recorder.stop(() => {
            speech.stt(recorder.blob())
            .then(res => res.text())
            .then(prompt => {
                chat.prompt(prompt.trim())
                .then(() => {
                    speech.show('start');
                })
            })
        })
    },

    stop: () => {
        speech.show('start');
        speech.hide('send');
        speech.hide('stop');
        (player.playing ? player : recorder).stop();
    }
};