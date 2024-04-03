from mistralai.client import MistralClient
import secrets

client = MistralClient(api_key = secrets.get('MISTRAL_API_KEY'))

from mistralai.models.chat_completion import ChatMessage

chat_response = client.chat(
    model = settings.model
    messages=[ChatMessage(role="user", content="Write a haiku about relativity.")],
)
