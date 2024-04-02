from fastapi import FastAPI
from fastapi.responses import HTMLResponse
import chat

app = FastAPI()

@app.get('/', response_class = HTMLResponse)
async def read():
    return open('index.html').read()

@app.get('/test')
async def read_test():
    return {'response': chat.tts(chat.process(chat.stt('peeps.mp3')))}