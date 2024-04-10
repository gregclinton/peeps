settings = { model: 'gpt', temperature: 5, sound: 'off', voice: 'echo' };
characters = [];

alfred = {
    prompt: async text => {
        let result;
        const instructions =
`
 Respond with just JSON.
 Keys must be camel-cased.
 Provide as many of the following keys as mentioned by the prompt:
 model (gpt, claude, gemini or mistral),
 temperature (between 0 (coldest) and 10 (hottest) inclusive),
 sound (on or off),
 characters (array of name, gender (male or female) and instruction),
 A character's instruction will be as to its behavior as in gpt system instruction.
 Input comes from speech-to-text, so spelling may not be right.
 Do your best.
 By the way, they call me Alfred. Just ignore my name in the prompt.
 Finally, provide an obsequiousReply as to what you did, like setting temperature or whatever.
 Try to sound like a butler with a wry sense of humor.
`;
        function process(jsonString) {
            const o = JSON.parse(jsonString);

            if (o.model) {
                settings.model = o.model;
            }
            if (o.temperature) {
                settings.temperature = o.temperature;
            }
            if (o.sound) {
                settings.sound = o.sound;
            }
            if (o.characters) {
                characters = characters.concat(o.characters);
            }
            result = o.obsequiousReply;
        }

        await fetch('/openai/v1/chat/completions', {
            method: 'POST',
            headers:  { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'system', content: instructions }, { role: 'user', content: text }],
                model: 'gpt-4-0125-preview',
                temperature: 0
            })
        })
        .then(response => response.json())
        .then(o => { process(o.choices[0].message.content) });

        return result;
    }
}