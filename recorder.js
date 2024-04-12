const recorder = {
    stream: 0,
    device: null,
    recording: false,

    start: () => {
        recorder.recording = true;
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
        recorder.recording = false;
    },

    send: () => {
        chat.waiting = true;
        recorder.stop(() => {
            recorder.stt(recorder.blob())
            .then(res => res.text())
            .then(prompt => {
                chat.prompt(prompt.trim());
            })
        })
    },

    blob: () => {
        recorder.stop();
        return recorder.device.getBlob();
    },

    stt: blob => {
        const data = new FormData();

        data.append('file', blob, 'stt.wav');
        data.append('model', 'whisper-1');
        data.append('language', 'en'); // optional but improves accuracy and latency
        data.append('response_format', 'text');

        return fetch('/openai/v1/audio/transcriptions', {
            method: 'POST',
            body: data
        })
    }
}