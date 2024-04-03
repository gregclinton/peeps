let recorder;
let recorderStream;
let recording = false;

function record() {
    if (recording) {
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
        recording = false;
    } else {
        recorder = new RecordRTC(recorderStream, {
            mimeType: 'audio/wav',
            timeSlice: 1000,
            recorderType: RecordRTC.StereoAudioRecorder,
            numberOfAudioChannels: 1,
            audioBitsPerSecond: 128000
        });

        recorder.startRecording();
        recording = true;
    }
}

navigator.mediaDevices.getUserMedia({ audio: true })
.then(stream => {
    recorderStream = stream;
})