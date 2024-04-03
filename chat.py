import gpt

items = []

def prompt(text):
    items.append({'prompt': text})
    response = gpt.respond(items)
    items.append({'response': response})
    return response

def clear():
    items = []