const peeps = {
    register: (name, instructions, voice, handler) => {
        const peep = { name: name, instructions: instructions, voice: voice, handler: handler };

        peeps[name] = peep;
        return  peep;
    }
}

peeps.register('Homer',
`
characters (object, keyed by name (preserve spaces if any), of voice(only if requested) and instruction),

The instruction addresses character as "you".
Instruct the character as to its behavior. It will be a gpt system instruction.

Voices alloy, shimmer, nova are for women and echo, fable(british), onyx for men.
`, 'none', o => {
    if (o.characters) {
        Object.entries(o.characters).forEach(([name, peep]) => {
            peep.voice = peep.voice || 'none'
            peep.name = name;
            peeps[name] = peep;
        });
    }
});

