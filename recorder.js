const recorder = {
    start: () => {
        recorder.recording = true;
        recorder.chunks = [];
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            recorder.stream = stream;
            recorder.device = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            recorder.device.ondataavailable = e => {
                recorder.chunks.push(e.data);
            };
            recorder.device.start();
        })
    },

    stop: () => {
        recorder.recording = false;
        recorder.device.onstop = () => {
            recorder.chunks = [];
            recorder.stream.getTracks().forEach(track => { track.stop(); });
        };
        recorder.device.stop();
    },

    send: () => {
        recorder.recording = false;
        recorder.device.onstop = () => {
            recorder.stream.getTracks().forEach(track => { track.stop(); });
            chat.waiting = true;
            const blob = new Blob(recorder.chunks, { type: 'audio/webm' });
            recorder.chunks = [];
            recorder.stt(blob)
            .then(res => res.text())
            .then(prompt => {
                chat.prompt(prompt.trim());
            });
        };
        recorder.device.stop();
    },

    stt: blob => {
        const data = new FormData();

        data.append('file', blob, 'stt.webm');
        data.append('model', 'whisper-1');
        data.append('language', 'en'); // optional but improves accuracy and latency
        data.append('response_format', 'text');

        return fetch('/openai/v1/audio/transcriptions', {
            method: 'POST',
            body: data
        })
    }
}