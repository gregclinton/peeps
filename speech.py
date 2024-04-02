from openai import OpenAI
import secrets

client = OpenAI(api_key = secrets.get('OPENAI_API_KEY'))

import warnings
warnings.filterwarnings('ignore', category = DeprecationWarning)

# consider using the free whisper model for improved latency

def tts(text, filename):
    client.audio.speech.create(
        model = "tts-1", # $15 / 1M characters
        voice = "alloy", # alloy, echo, fable, onyx, nova, and shimmer
        speed = 3.5, 
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