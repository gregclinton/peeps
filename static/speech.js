const recorder = {
    audio: 0,
    stream: 0,
    recording: false,

    start: () => {
        recorder.audio = new RecordRTC(recorder.stream, {
            mimeType: 'audio/wav',
            timeSlice: 1000,
            recorderType: RecordRTC.StereoAudioRecorder,
            numberOfAudioChannels: 1,
            audioBitsPerSecond: 128000
        });

        recorder.audio.startRecording();
        recorder.recording = true;
    },

    send: () => {
        recorder.audio.stopRecording(() => {
            const data = new FormData();

            data.append("file", recorder.audio.getBlob(), 'audio/prompt.wav');

            fetch('/chat/', {
                method: 'POST',
                body: data,
            })
            .then(response => response.blob())
            .then(blob => {
                new Audio(URL.createObjectURL(blob)).play();
            });
        });
        recorder.recording = false;
    },

    cancel: () => {
        recorder.audio_.stopRecording();
        recorder.recording = false;
    }
};

navigator.mediaDevices.getUserMedia({ audio: true })
.then(stream => {
    recorder.stream = stream;
})