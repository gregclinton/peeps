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

 If I want to hear the character, use alloy, shimmer, nova for women and echo, fable, onyx for men.
 Otherwise if I don't mention it, voice is "none".

 fable voice is british sounding.
 `, 'none', o => {
    if (o.characters) {
        Object.entries(o.characters).forEach(([name, peep]) => {
            peep.name = name;
            peeps[name] = peep;
        });
    }
});

