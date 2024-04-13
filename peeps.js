let peeps = {
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
 Instruct the character not to ever mention its name unless specifically asked.
 The character is role playing, should pretend to be a person and not an AI.

 Only include a character's voice selection (alloy, shimmer, nova for women; echo, fable, onyx for men) if I explicitly request it.
 If no voice preference is mentioned, omit the voice attribute entirely.

 fable is british sounding.
 `, 'none', o => {
    if (o.characters) {
        peeps = { ...peeps, ...o.characters };
    }
});

