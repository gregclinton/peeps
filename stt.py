import openai

def get(mp3):
    with open(mp3, 'rb') as audio_file:
        return client.audio.transcriptions.create(
            file = audio_file,
            model = "whisper-1" # 1 penny per 100 seconds
        ).text