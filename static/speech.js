const speech = {
    stream: 0,

    stt: blob => {
        const data = new FormData();

        data.append("file", blob, 'audio/stt.wav');

        return fetch('/stt/', {
            method: 'PUT',
            body: data,
        })
    },

    tts: text => {
        return fetch('/tts/', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({text: text, voice: settings.voice})
        })
    },

    start: () => {
        document.getElementById('speech-start').hidden = true;
        document.getElementById('speech-send').hidden = false;
        document.getElementById('speech-stop').hidden = false;

        recorder.start(speech.stream);
    },

    send: () => {
        document.getElementById('speech-send').hidden = true;
        recorder.stop(() => {
            speech.stt(recorder.blob())
            .then(res => res.text())
            .then(prompt => {
                chat.add('you', prompt);
                chat.prompt(prompt, settings.model)
                .then(response => {
                    response = response.replace(/\\/g, '\\\\');  // so markdown won't trample LaTex
                    chat.add(settings.model, marked.parse(response));
                    MathJax.typesetPromise();
                    if (settings.voice === 'none')
                    {
                        document.getElementById('speech-start').hidden = false;
                        document.getElementById('speech-stop').hidden = true;
                    } else {
                        speech.tts(response, settings.voice)
                        .then(res => res.blob())
                        .then(blob => {
                            player.play(blob, () => {
                                document.getElementById('speech-start').hidden = false;
                                document.getElementById('speech-stop').hidden = true;
                            });
                        });
                    }
                })
            })
        })
    },

    stop: () => {
        document.getElementById('speech-send').hidden = true;
        document.getElementById('speech-stop').hidden = true;
        document.getElementById('speech-start').hidden = false;
        (player.playing ? player : recorder).stop();
    }
};

navigator.mediaDevices.getUserMedia({ audio: true })
.then(stream => {
    speech.stream = stream;
})