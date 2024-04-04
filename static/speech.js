const speech = {
    stream: 0,
    recorder: 0,
    player: 0,

    start: () => {
        document.getElementById('speech-start').hidden = true;
        document.getElementById('speech-send').hidden = false;
        document.getElementById('speech-stop').hidden = false;

        speech.recorder = new RecordRTC(speech.stream, {
            mimeType: 'audio/wav',
            timeSlice: 1000,
            recorderType: RecordRTC.StereoAudioRecorder,
            numberOfAudioChannels: 1,
            audioBitsPerSecond: 128000
        });

        speech.recorder.startRecording();
    },

    send: () => {
        document.getElementById('speech-send').hidden = true;
        speech.recorder.stopRecording(() => {
            const data = new FormData();

            data.append("file", speech.recorder.getBlob(), 'audio/prompt.wav');

            fetch('/stt/', {
                method: 'PUT',
                body: data,
            })
            .then(response => response.text())
            .then(text => {
                fetch('/chat/', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({text: text})
                })
                .then(response => response.text())
                .then(text => {
                    fetch('/tts/', {
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({text: text})
                    })
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
        });
    },

    stop: () => {
        document.getElementById('speech-send').hidden = true;
        document.getElementById('speech-stop').hidden = true;
        document.getElementById('speech-start').hidden = false;
        if (speech.player) {
            speech.player.pause();
            speech.player = 0;
        } else {
            speech.recorder.stopRecording();
        }
    }
};

navigator.mediaDevices.getUserMedia({ audio: true })
.then(stream => {
    speech.stream = stream;
})