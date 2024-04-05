import google.generativeai as genai
import secrets

genai.configure(api_key = secrets.get('GEMINI_API_KEY'))

def respond(chat, model):
    transcript = ''

    for item in chat:
        for k, v in item.items():
            transcript += k + ': ' + v

    transcript += 'response: '
    return genai.GenerativeModel(model).generate_content(transcript).text
