const recorder = {
    audio: 0,
    stream: 0,
    recording: false,

    toggle() {
        recorder.recording = !recorder.recording;

        const parent = document.getElementById('recorder').classList;
        const start = document.getElementById('recorder-start').classList;
        const stop = document.getElementById('recorder-stop').classList;
        const send = document.getElementById('recorder-send').classList;

        parent.remove('hidden');
        start.remove('hidden');
        stop.remove('hidden');
        send.remove('hidden');

        if (recorder.recording) {
            start.add('hidden');
        } else {
            stop.add('hidden');
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
        document.getElementById('recorder').classList.add('hidden');
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