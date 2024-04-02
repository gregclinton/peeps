from openai import OpenAI
import warnings
warnings.filterwarnings('ignore', category = DeprecationWarning)

def get(text):
    client.audio.speech.create(
        model = "tts-1", # $15 / 1M characters
        voice = "alloy",# alloy, echo, fable, onyx, nova, and shimmer
        speed = 3.5, 
        input = "Hello, everyone."
    ).stream_to_file('peep.mp3')