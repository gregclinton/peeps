const player = {
    device: null,
    playing: false,
    play: (blob) => {
        player.device = new Audio(URL.createObjectURL(blob));
        player.device.play();
        player.device.onended = () => {
            player.playing = false;
            player.device = null;
        }
        player.playing = true;
    },

    stop: () => {
        player.device.pause();
        player.device.src = '';
        player.device.load();
        player.playing = false;
    },

    tts: async (text, voice) => {
        fetch('/openai/v1/audio/speech', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                model: "tts-1",
                voice: voice,
                input: text
            })
        })
        .then(res => res.blob())
        .then(blob => { player.play(blob) });
    }
}