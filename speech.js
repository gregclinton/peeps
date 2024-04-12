const speech = {
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
        .then(blob => { player.play(blob) });
    },

    start: () => {
        recorder.start();
    },

    send: () => {
        chat.waiting = true;
        recorder.stop(() => {
            speech.stt(recorder.blob())
            .then(res => res.text())
            .then(prompt => {
                chat.prompt(prompt.trim());
            })
        })
    },

    stop: () => {
        (player.playing ? player : recorder).stop();
    }
};