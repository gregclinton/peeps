settings = { model: 'gpt', temperature: 5, voice: 'none' };
characters = {};

alfred = {
    prompt: async text => {
        const instructions =
`
 Respond with JSON.
 Keys must be camel-cased.
 Provide as many of the following keys as mentioned by the prompt:
 model (gpt, claude, gemini or mistral),
 temperature (between 0 (coldest) and 10 (hottest) inclusive),
 voice,
 characters (object, keyed by name, of voice and instruction),
 A character's instruction will instruct it, addressing it as you, to its behavior as in gpt system instruction.
 Preserve any spaces in the name, such as "John Henry".

 alloy, shimmer and nova are women voices,
 echo, fable, and onyx are men voices.
 alloy and fable are british sounding.
 none to not hear any voice.

 Input comes from speech-to-text, so spelling may not be right.
 Do your best.
 By the way, they call me Alfred. Just ignore my name in the prompt.
 Finally, provide an obsequiousReply as to what you did, like setting temperature or whatever.
 Try to sound like a butler with a wry sense of humor.
`;

        let result;

        await fetch('/openai/v1/chat/completions', {
            method: 'POST',
            headers:  { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'system', content: instructions }, { role: 'user', content: text }],
                model: 'gpt-4-0125-preview',
                temperature: 0,
                response_format: { "type": "json_object" }
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
            result = o.obsequiousReply;
        });

        return result;
    }
}