import anthropic
import secrets

client = anthropic.Anthropic(api_key = secrets.get('ANTHROPIC_API_KEY'))

def prompt(messages):
    return client.messages.create(
        model = settings.model,
        max_tokens = 1000,
        temperature = 0.0,
        system = "You are a helpful assistant.",
        messages = [
            { "role": "user", "content": text }
        ]
    ).content[0].text
    