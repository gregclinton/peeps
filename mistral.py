from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
import secrets

client = MistralClient(api_key = secrets.get('MISTRAL_API_KEY'))

def prompt(messages):
    messages = []

    for item in chat:
        for k, v in item.items():
            messages.append(ChatMessage(role = 'user' if k == 'prompt' else 'assistant', content = v));

    return client.chat(model = settings.model, messages=messages).choices[0].message.content
