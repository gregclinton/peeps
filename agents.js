agents = {
    register: (name, instructions, handler) => {
        agents[name] = { instructions: instructions, handler: handler };
    },

    prompt: async (name, text) => {
        const agent = agents[name];
        let result;
        const instructions = 'Respond with JSON.\n' + agent.instructions +
            '\nProvide key "reply" telling what you did in a lighthearted way.';

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

            agent.handler(o);
            result = o.reply || 'Done.';
        });

        return result;
    }
}