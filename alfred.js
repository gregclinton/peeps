settings = { model: 'gpt', temperature: 5 };

alfred = {
    prompt: text => {
        return 'Your wish is my command: ' + text;
    }
}