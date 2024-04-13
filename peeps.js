const peeps = {
    register: (name, instructions, voice, handler) => {
        const peep = { name: name, instructions: instructions, voice: voice, handler: handler };

        peeps[name] = peep;
        return  peep;
    }
}

peeps.register('Homer',
`
characters (object, keyed by name (preserve spaces if any), of voice and instruction),

The instruction addresses character as "you".
Instruct the character as to its behavior. It will be a gpt system instruction.

If I want to hear a voice, I'll say so or hint at it.
If so, use alloy, shimmer, nova for women and echo, fable, onyx for men.
If I don't, set voice to "none".

fable for a british voice.
`, 'none', o => {
    if (o.characters) {
        Object.entries(o.characters).forEach(([name, peep]) => {
            peep.name = name;
            peeps[name] = peep;
        });
    }
});

