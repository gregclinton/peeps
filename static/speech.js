let recorder;

function record() {
    if (recorder.recording) {
        recorder.stopRecording(() => {
            const data = new FormData();

            data.append("file", recorder.getBlob(), 'audio/prompt.wav');

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
    } else {
        recorder.startRecording();
        recorder.recording = true;
    }
}

navigator.mediaDevices.getUserMedia({ audio: true })
.then(stream => {
    recorder = new RecordRTC(stream, {
        mimeType: 'audio/wav',
        timeSlice: 1000,
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
        audioBitsPerSecond: 128000
    });
})