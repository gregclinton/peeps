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
    }
}