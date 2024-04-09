settings = { model: 'gpt', temperature: 5, sound: 'off', voice: 'echo' };

alfred = {
    prompt: async text => {
        let result;
        const instructions =
`
 You are going to respond with just JSON.
 Keys must be camel-cased.
 Provide as many of the following keys as mentioned by the prompt:
 model, temperature, sound, character and timeSlot.
 Temperature must be between 0 (coldest) and 10 (hottest) inclusive
 Model should be gpt, claude, gemini or mistral.
 Sound can be on or off.
 Also, we might want to create a character.
 A character has a name, gender (male or female) and instructions (as to the character's behavior as in gpt system instructions).
 Input comes from speech-to-text, so spelling may not be right.
 Do your best.
 By the way, they call me Alfred. Just ignore my name in the prompt.
 Finally, provide an obsequiousReply as to what you did, like setting temperature or whatever.
 Try to sound like a butler with a wry sense of humor.
`;
        function process(jsonString) {
            o = JSON.parse(jsonString);
            if (o.model) {
                settings.model = o.model;
            }
            if (o.temperature) {
                settings.temperature = o.temperature;
            }
            if (o.sound) {
                settings.sound = o.sound;
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