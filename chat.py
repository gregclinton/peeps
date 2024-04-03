import gpt

items = []

def prompt(text):
    response = gpt.respond(items)
    items.append({'prompt': text, 'response': response})
    return response

def clear():
    items = []