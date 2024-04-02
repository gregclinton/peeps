from fastapi import FastAPI, File, UploadFile
from fastapi.responses import HTMLResponse, FileResponse
from chat import process
from speech import stt, tts

app = FastAPI()

@app.get('/', response_class = HTMLResponse)
async def read():
    return open('index.html').read()

@app.get('/test')
async def read_test(wav: UploadFile = File(...)):
    tts(process(stt(wav.filename)), 'out.mp3')
    return FileResponse('out.mp3')
