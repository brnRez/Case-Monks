from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, metrics

app = FastAPI(
    title="Case Monks API",
    description="API com autenticação para visualização de relatório de métricas"
)

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
    "http://127.0.0.1:5500",
    "http://127.0.0.1:5500/frontend/index.html"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(metrics.router)

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Bem vindo ao projeto de entrega do Case!"}