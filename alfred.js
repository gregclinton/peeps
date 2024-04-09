settings = { model: 'gpt', temperature: 5 };

alfred = {
    prompt: async text => {
        const instructions = 'Make it brief';
        let result;

        await fetch('/openai/v1/chat/completions', {
            method: 'POST',
            headers:  { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'system', content: instructions }, { role: 'user', content: 'Who is Bill Maher' }],
                model: 'gpt-4-0125-preview',
                temperature: 2.0 * settings.temperature / 10.0
            })
        })
        .then(response => response.json())
        .then(o => { result = o });

        return result.choices[0].message.content;;
    }
}