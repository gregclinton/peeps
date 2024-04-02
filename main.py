from fastapi import FastAPI
from fastapi.responses import HTMLResponse, FileResponse
import chat

app = FastAPI()

@app.get('/', response_class = HTMLResponse)
async def read():
    return open('index.html').read()

@app.get('/test')
async def read_test():
    chat.tts(chat.process(chat.stt('in.mp3')), 'out.mp3')
    return FileResponse('out.mp3')
