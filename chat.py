import gpt, claude, gemini, mistral

def prompt(messages, model, temperature):
    csps = [gpt, claude, gemini, mistral]

    for i, s in enumerate(map(lambda x: x.__name__, csps)):
        if model.startswith(s):
            response = csps[i].respond(messages, model, temperature)
            break

    return response