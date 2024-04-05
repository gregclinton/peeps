import google.generativeai as genai
import secrets

genai.configure(api_key = secrets.get('GEMINI_API_KEY'))

def respond(chat, model):
    transcript = "\n".join(f"{k}: {v}" for d in chat for k, v in d.items()) + '\response: '
    return genai.GenerativeModel(model).generate_content(transcript).text
