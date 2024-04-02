from fastapi import FastAPI, File, UploadFile
from fastapi.responses import HTMLResponse, FileResponse
from chat import process
from speech import stt, tts
import shutil

app = FastAPI()

@app.get('/', response_class = HTMLResponse)
async def read():
    return open('index.html').read()

@app.post("/chat/")
async def post_to_chat(file: UploadFile = File(...)):
    with open(file.filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    q = stt(file.filename);
    if q and len(q) > 0:
        print(q)
        a = process(q);
        if a and len(a) > 0:
            print(a)
            tts(a, 'out.wav')
            return FileResponse('out.wav')
    raise HTTPException(status_code = 404);