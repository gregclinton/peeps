const speech = {
    recorder: 0,
    stream: 0,
    audio: 0,

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

            fetch('/chat/', {
                method: 'POST',
                body: data,
            })
            .then(response => response.blob())
            .then(blob => {
                speech.audio = new Audio(URL.createObjectURL(blob));
                speech.audio.play();
                speech.audio.onended = () => {
                    document.getElementById('speech-start').hidden = false;
                    document.getElementById('speech-stop').hidden = true;
                    speech.audio = 0;
                };
            });
        });
    },

    stop: () => {
        document.getElementById('speech-send').hidden = true;
        document.getElementById('speech-stop').hidden = true;
        document.getElementById('speech-start').hidden = false;
        if (speech.audio) {
            speech.audio.pause();
            speech.audio = 0;
        } else {
            speech.recorder.stopRecording();
        }
    }
};

navigator.mediaDevices.getUserMedia({ audio: true })
.then(stream => {
    speech.stream = stream;
})