const recorder = {
    audio: 0,
    stream: 0,
    recording: false,

    toggle() {
        recorder.recording = !recorder.recording;

        const parent = document.getElementById('recorder');
        const start = document.getElementById('recorder-start');
        const stop = document.getElementById('recorder-stop');
        const send = document.getElementById('recorder-send');

        parent.hidden = false;
        start.hidden = false;
        stop.hidden = false;
        send.hidden = false;

        if (recorder.recording) {
            start.hidden = true;
        } else {
            stop.hidden = true;
        }
    },

    start: () => {
        recorder.audio = new RecordRTC(recorder.stream, {
            mimeType: 'audio/wav',
            timeSlice: 1000,
            recorderType: RecordRTC.StereoAudioRecorder,
            numberOfAudioChannels: 1,
            audioBitsPerSecond: 128000
        });

        recorder.audio.startRecording();
        recorder.toggle();
    },

    send: () => {
        document.getElementById('recorder').hidden = true;
        recorder.audio.stopRecording(() => {
            const data = new FormData();

            data.append("file", recorder.audio.getBlob(), 'audio/prompt.wav');

            fetch('/chat/', {
                method: 'POST',
                body: data,
            })
            .then(response => response.blob())
            .then(blob => {
                new Audio(URL.createObjectURL(blob)).play().then(recorder.toggle);
            });
        });
    },

    cancel: () => {
        recorder.audio.stopRecording(recorder.toggle);
    }
};

navigator.mediaDevices.getUserMedia({ audio: true })
.then(stream => {
    recorder.stream = stream;
    recorder.toggle();
    recorder.toggle();
})