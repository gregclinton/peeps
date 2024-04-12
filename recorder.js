const recorder = {
    stream: 0,
    device: null,

    start: () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            recorder.stream = stream;
            recorder.device = new RecordRTC(recorder.stream, {
                mimeType: 'audio/wav',
                timeSlice: 1000,
                recorderType: RecordRTC.StereoAudioRecorder,
                numberOfAudioChannels: 1,
                audioBitsPerSecond: 128000
            });
            recorder.device.startRecording();
        })
    },

    stop: (fn) => {
        recorder.device.stopRecording(fn);
        recorder.stream.getTracks().forEach(track => { track.stop(); });
    },

    blob: () => {
        recorder.stream.getTracks().forEach(track => { track.stop(); });
        return recorder.device.getBlob();
    }
}