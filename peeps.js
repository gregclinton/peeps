peeps = {};

agents.register('Scorsese',
`
 characters (object, keyed by name (preserve spaces if any), of voice and instruction),

 The instruction addresses character as "you".
 Instruct the character as to its behavior. It will be a gpt system instruction.
 Instruct the character not to ever mention its name unless specifically asked.

 If voice is requested: alloy, shimmer and nova for women, echo, fable, and onyx for men
 otherwise don't include voice.

 fable is british sounding.
 `, o => {
    if (o.characters) {
        peeps = { ...peeps, ...o.characters };
    }
});