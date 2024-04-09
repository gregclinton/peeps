settings = { model: 'gpt', temperature: 5 };

alfred = {
    prompt: async text => {
        let result;
        const instructions =
`
 You are going to respond with just JSON.
 Keys must be camel-cased.
 Provide as many of the following keys as mentioned by the prompt:
 model, temperature and timeSlot.
 Temperature must be between 0 (coldest) and 10 (hottest) inclusive
 Model should be gpt, claude, gemini or mistral.
 Input comes from speech-to-text, so spelling may not be right.
 Do your best.
 By the way, they call me Alfred. Just ignore my name in the prompt.
`;
        function process(jsonString) {
            result = jsonString;
            o = JSON.parse(jsonString);
            if (o.model) {
                settings.model = o.model;
            }
            if (o.temperature) {
                settings.temperature = o.temperature;
            }
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