import google.generativeai as genai
import secrets

genai.configure(api_key = secrets.get('GEMINI_API_KEY'))

model = genai.GenerativeModel(
#   ai.google.dev/models/gemini         context in/out     RPM  $in/$out/M char   trained
#   'gemini-ultra'                 #
    'gemini-1.0-pro-001'           #       30,720/2,048     60      free          Feb '24
#   'gemini-1.5-pro-latest'        #    1,048,576/8,192      2      free          Feb '24
#   'gemini-nano'                  #
#   enterprise ???                                                 0.13/0.38
)
print(model.generate_content("Write a haiku about relativity.").text)