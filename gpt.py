from openai import OpenAI
import secrets
import settings

client = OpenAI(api_key = secrets.get('OPENAI_API_KEY'))

def respond(chat):
    messages = [ {"role": "system", "content": "You are a helpful assistant."} ];

    for item in chat:
        for k, v in item.items():
            messages.append({'role': 'user' if k == 'prompt' else 'assistant', 'content': v});

    return client.chat.completions.create(
        model = settings['model'],
        messages = messages
    ).choices[0].message.content