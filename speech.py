from openai import OpenAI
import secrets

client = OpenAI(api_key = secrets.get('OPENAI_API_KEY'))

import warnings
warnings.filterwarnings('ignore', category = DeprecationWarning)

def tts(text, voice, filename):
    client.audio.speech.create(
        model = "tts-1", # $15 / 1M characters
        voice = voice,
        speed = 1, 
        input = text,
        response_format = 'wav'
    ).stream_to_file(filename)

def stt(filename):
    with open(filename, 'rb') as audio_file:
        return client.audio.transcriptions.create(
            file = audio_file,
            language = 'en',  # optional but improves accuracy and latency
            model = 'whisper-1', # 100 seconds for a penny, 
            response_format = 'text'
        )