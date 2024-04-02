from fastapi import FastAPI
from fastapi.responses import HTMLResponse
import chat

app = FastAPI()

@app.get('/', response_class = HTMLResponse)
async def read():
    return open('index.html').read()

@app.get('/test')
async def read_test():
    chat.stt('xxx.mp3')
    return {'abc': chat.haiku()}

@app.get('/foo')
async def read_foo():
    chat.tts(chat.haiku);
    return {'abc': chat.haiku()}