settings = { model: 'gemini', temperature: 5 };

peeps.register('Alfred',
`
 Provide as many of the following keys as mentioned by the prompt:
     model (gpt, claude, gemini or mistral),
     temperature (between 0 (coldest) and 10 (hottest) inclusive),
 If a key is not mentioned or hinted at, omit that key entirely.
`, 'none', o => {
    settings = {...settings, ...o};
    delete settings.reply;
});