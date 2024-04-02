from fastapi import FastAPI, File, UploadFile
from fastapi.responses import HTMLResponse, FileResponse
from chat import process
from speech import stt, tts

app = FastAPI()

@app.get('/', response_class = HTMLResponse)
async def read():
    return open('index.html').read()

@app.post("/chat/")
async def read_chat(audio: UploadFile = File(...)):
    print(audio.filename)
    return FileResponse(audio.filename)
    tts(process(stt(audio.filename)), 'out.wav')
    return FileResponse('out.wav')
