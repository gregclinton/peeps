const player = {
    device: null,
    playing: false,

    play: async (blob) => {
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
        player.playing = false;
    }
}