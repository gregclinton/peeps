from openai import OpenAI
import secrets

client = OpenAI(api_key = secrets.get('OPENAI_API_KEY'))

def respond(chat, model, temperature):
    messages = [ {"role": "system", "content": "You are a helpful assistant. Keep your answers brief."} ];

    for item in chat:
        for k, v in item.items():
            messages.append({'role': 'user' if k == 'prompt' else 'assistant', 'content': v});

    return client.chat.completions.create(
        model = model,
        messages = messages,
        temperature = 2.0 * temperature / 8.0
    ).choices[0].message.content