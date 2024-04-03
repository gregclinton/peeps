from openai import OpenAI
import secrets

client = OpenAI(api_key = secrets.get('OPENAI_API_KEY'))

import warnings
warnings.filterwarnings('ignore', category = DeprecationWarning)

# consider using the free whisper model for improved latency

def tts(text, filename):
    client.audio.speech.create(
        model = "tts-1", # $15 / 1M characters
        voice = "echo", # alloy, echo, fable, onyx, nova, and shimmer
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

# from transformers import pipeline

# def stt_whisper(filename):
#     pipe = pipeline(
#         task = "automatic-speech-recognition",
#         model = "openai/whisper-tiny",
#         device = 'cpu')

#     return pipe('peeps.wav', return_timestamps=True, chunk_length_s=30, stride_length_s=[6,0], batch_size=32).text