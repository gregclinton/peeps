import gpt, claude, gemini, mistral

items = []

def prompt(text):
    items.append({'prompt': text})

    csps = [gpt, claude, gemini, mistral]

    for i, s in enumerate(map(lambda x: x.__name__, csps)):
        if m.startswith(s):
            csps[i].respond(items)
            break

    items.append({'response': response})
    return response

def clear():
    items.clear()