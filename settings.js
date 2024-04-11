settings = { model: 'gpt', temperature: 5 };

agents.register('Alfred',
`
 Provide as many of the following keys as mentioned by the prompt:
     model (gpt, claude, gemini or mistral),
     temperature (between 0 (coldest) and 10 (hottest) inclusive),
`, o => {
    settings = {...settings, ...o};
    delete settings.reply;
});