const player = {
    device: null,
    playing: false,

    play: (blob, fn) => {
        player.device = new Audio(URL.createObjectURL(blob));
        player.device.play();
        player.device.onended = () => {
            player.playing = false;
            fn();
            player.device = null;
        }
        player.playing = true;
    },

    stop: () => {
        player.device.pause();
        player.playing = false;
    }
}