from fastapi import FastAPI, File, UploadFile
from fastapi.responses import HTMLResponse, FileResponse
import chat

app = FastAPI()

@app.get('/', response_class = HTMLResponse)
async def read():
    return open('index.html').read()

@app.get('/test')
async def read_test(wav: UploadFile = File(...)):
    chat.tts(chat.process(chat.stt(wav.filename)), 'out.mp3')
    return FileResponse('out.mp3')
