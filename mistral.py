from mistralai.client import MistralClient
import secrets

client = MistralClient(api_key = secrets.get('MISTRAL_API_KEY'))

from mistralai.models.chat_completion import ChatMessage

chat_response = client.chat(
# docs.mistral.ai/platform/pricing          $in/$out/M
     model = 'mistral-small-latest',   #        2/6
#   model = 'mistral-medium-latest',   #      2.7/8.1
#   model = 'mistral-large-latest',    #        8/24
    messages=[ChatMessage(role="user", content="Write a haiku about relativity.")],
)
