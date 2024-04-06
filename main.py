from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse, PlainTextResponse
from fastapi.staticfiles import StaticFiles
import chat
from speech import stt
from pathlib import Path
import shutil

app = FastAPI()
app.mount("/static", StaticFiles(directory = "static"), name ="static")

@app.get("/")
async def get_index():
    return FileResponse(Path("static/index.html"))

@app.get("/{filename:path}")
async def get_static_file(filename: str):
    static_path = Path(f"static/{filename}")
    return FileResponse(static_path)

@app.post("/chat/", response_class = PlainTextResponse)
async def post_to_chat(o: dict):
    return chat.prompt(o['messages'], o['model'])

@app.put("/stt/", response_class = PlainTextResponse)
async def put_stt(file: UploadFile = File(...)):
    with open(file.filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return stt(file.filename)

async def http_exception_handler(request, exc):
    return PlainTextResponse(str(exc.detail), status_code = exc.status_code)