settings = { model: 'gpt', temperature: 5, voice: 'none' };
characters = {};

alfred = {
    prompt: async text => {
        const instructions =
`
 Respond with JSON.
 Provide as many of the following keys as mentioned by the prompt:
 model (gpt, claude, gemini or mistral),
 temperature (between 0 (coldest) and 10 (hottest) inclusive),

 voice,
 alloy, shimmer and nova are women voices,
 echo, fable, and onyx are men voices.
 fable is british sounding.
 none to not hear any voice.

 characters (object, keyed by name (preserve spaces if any), of voice and instruction),
 The instruction addresses character as "you".
 Instruct the character as to its behavior. It will be a gpt system instruction.

 Provide an obsequiousReply as to what you did, like setting temperature or creating a character or whatever.
 Your name is Alfred. Try to sound like a butler with a wry sense of humor.
`;

        let result;

        await fetch('/openai/v1/chat/completions', {
            method: 'POST',
            headers:  { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'system', content: instructions }, { role: 'user', content: text }],
                model: 'gpt-4-0125-preview',
                temperature: 0,
                response_format: { type: "json_object" }
            })
        })
        .then(res => res.json())
        .then(res => {
            const o = JSON.parse(res.choices[0].message.content);

            if (o.model) {
                settings.model = o.model;
            }
            if (o.temperature) {
                settings.temperature = o.temperature;
            }
            if (o.voice) {
                settings.voice = o.voice;
            }
            if (o.characters) {
                characters = { ...characters, ...o.characters };
            }
            result = o.obsequiousReply || 'Your wish is my command.';
        });

        return result;
    }
}