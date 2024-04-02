from openai import OpenAI
import secrets

client = OpenAI(api_key = secrets.get('OPENAI_API_KEY'))

import warnings
warnings.filterwarnings('ignore', category = DeprecationWarning)

def tts(text, mp3):
    client.audio.speech.create(
        model = "tts-1", # $15 / 1M characters
        voice = "alloy",# alloy, echo, fable, onyx, nova, and shimmer
        speed = 3.5, 
        input = "Hello, everyone."
    ).stream_to_file(mp3)

def stt(mp3):
    with open(mp3, 'rb') as audio_file:
        return client.audio.transcriptions.create(
            file = audio_file,
            model = "whisper-1" # 1 penny per 100 seconds
        ).text