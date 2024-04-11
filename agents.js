settings = { model: 'gpt', temperature: 5, voice: 'none' };

agents = {
    register: (name, instructions, handler) => {
        agents[name] = { instructions: instructions, handler: handler };
    },

    prompt: async (name, text) => {
        const agent = agents[name];
        let result;

        await fetch('/openai/v1/chat/completions', {
            method: 'POST',
            headers:  { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'system', content: 'Respond with JSON.\n' + agent.instructions }, { role: 'user', content: text }],
                model: 'gpt-4-0125-preview',
                temperature: 0,
                response_format: { type: "json_object" }
            })
        })
        .then(res => res.json())
        .then(res => {
            const o = JSON.parse(res.choices[0].message.content);

            agent.handler(o);
            result = o.reply || 'Done.';
        });
    }
}

agents.register('Alfred',
`
 Provide as many of the following keys as mentioned by the prompt:
 model (gpt, claude, gemini or mistral),
 temperature (between 0 (coldest) and 10 (hottest) inclusive),

 Provide reply as to what you did, like setting temperature or whatever.
 Try to sound like a butler with a wry sense of humor.
`, o => {
    if (o.model) {
        settings.model = o.model;
    }
    if (o.temperature) {
        settings.temperature = o.temperature;
    }
});

peeps = {};

agents.register('Scorsese',
`
 characters (object, keyed by name (preserve spaces if any), of voice and instruction),
 The instruction addresses character as "you".
 Instruct the character as to its behavior. It will be a gpt system instruction.

 if voice is requested: alloy, shimmer and nova for women, echo, fable, and onyx for men
 fable is british sounding.

 Provide reply as to what you did. Try to sound like a movie director.
 `, o => {
    if (o.characters) {
        peeps = { ...peeps, ...o.characters };
    }
});