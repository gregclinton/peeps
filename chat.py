import gpt, claude, gemini, mistral

items = []

def prompt(text, model):
    items.append({'prompt': text})

    csps = [gpt, claude, gemini, mistral]

    for i, s in enumerate(map(lambda x: x.__name__, csps)):
        if model.startswith(s):
            response = csps[i].respond(items, model)
            break

    items.append({'response': response})
    return response

def clear():
    items.clear()