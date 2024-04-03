import google.generativeai as genai
import secrets

genai.configure(api_key = secrets.get('GEMINI_API_KEY'))

model = genai.GenerativeModel(settings.model)

print(model.generate_content("Write a haiku about relativity.").text)