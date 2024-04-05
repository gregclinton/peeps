import anthropic
import secrets

client = anthropic.Anthropic(api_key = secrets.get('ANTHROPIC_API_KEY'))

def respond(chat, model):
    messages = []

    for item in chat:
        for k, v in item.items():
            messages.append({'role': 'user' if k == 'prompt' else 'assistant', 'content': v});

    return client.messages.create(
        model = model,
        max_tokens = 1000,
        temperature = 0.0,
        system = "You are a helpful assistant.",
        messages = messages
    ).content[0].text