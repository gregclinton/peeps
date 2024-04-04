const recorder = {
    rec: null,

    start: (stream) => {
        recorder.rec = new RecordRTC(stream, {
            mimeType: 'audio/wav',
            timeSlice: 1000,
            recorderType: RecordRTC.StereoAudioRecorder,
            numberOfAudioChannels: 1,
            audioBitsPerSecond: 128000
        });

        recorder.rec.startRecording();
    },

    stop: (fn) => {
        recorder.rec.stopRecording(fn);
    },

    blob: () => {
        return recorder.rec.getBlob();
    }
}

const speech = {
    stream: 0,
    recorder: 0,
    player: 0,

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
            body: JSON.stringify({text: text})
        })
    },

    start: (stream) => {
        document.getElementById('speech-start').hidden = true;
        document.getElementById('speech-send').hidden = false;
        document.getElementById('speech-stop').hidden = false;

        recorder.start(speech.stream);
    },

    send: () => {
        document.getElementById('speech-send').hidden = true;
        recorder.stop(() => {
            speech.stt(recorder.blob())
            .then(response => response.text())
            .then(text => {
                chat.prompt(text)
                .then(response => response.text())
                .then(text => {
                    speech.tts(text)
                    .then(response => response.blob())
                    .then(blob => {
                        speech.player = new Audio(URL.createObjectURL(blob));
                        speech.player.play();
                        speech.player.onended = () => {
                            document.getElementById('speech-start').hidden = false;
                            document.getElementById('speech-stop').hidden = true;
                            speech.player = 0;
                        };
                    });
                })
            })
        })
    },

    stop: () => {
        document.getElementById('speech-send').hidden = true;
        document.getElementById('speech-stop').hidden = true;
        document.getElementById('speech-start').hidden = false;
        if (speech.player) {
            speech.player.pause();
            speech.player = 0;
        } else {
            recorder.stop();
        }
    }
};

navigator.mediaDevices.getUserMedia({ audio: true })
.then(stream => {
    speech.stream = stream;
})