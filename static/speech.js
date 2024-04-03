const speech = {
    recorder: 0,
    stream: 0,
    recording: false,

    start: () => {
        speech.recorder = new RecordRTC(speech.stream, {
            mimeType: 'audio/wav',
            timeSlice: 1000,
            recorderType: RecordRTC.StereoAudioRecorder,
            numberOfAudioChannels: 1,
            audioBitsPerSecond: 128000
        });

        speech.recorder.startRecording();
        document.getElementById('speech-start').hidden = true;
        document.getElementById('speech-send').hidden = false;
        document.getElementById('speech-stop').hidden = false;
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
                new Audio(URL.createObjectURL(blob)).play().then(() => {
                    document.getElementById('speech-stop').hidden = true;
                });
            });
        });
    },

    stop: () => {
        document.getElementById('speech-stop').hidden = true;
        document.getElementById('speech-send').hidden = true;
        speech.recorder.stopRecording(() => {
            document.getElementById('speech-start').hidden = false;
        });
    }
};

navigator.mediaDevices.getUserMedia({ audio: true })
.then(stream => {
    speech.stream = stream;
})