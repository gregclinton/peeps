const recorder = {
    device: null,

    start: (stream) => {
        recorder.device = new RecordRTC(stream, {
            mimeType: 'audio/wav',
            timeSlice: 1000,
            recorderType: RecordRTC.StereoAudioRecorder,
            numberOfAudioChannels: 1,
            audioBitsPerSecond: 128000
        });

        recorder.device.startRecording();
    },

    stop: (fn) => {
        recorder.device.stopRecording(fn);
    },

    blob: () => {
        return recorder.device.getBlob();
    }
}