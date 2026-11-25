import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI(
    title="MASE V2 API",
    description="Multi-Agent Simulation Engine with Learned Routing",
    version="0.1.0",
)

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check() -> dict[str, str]:
    """Return basic service health status."""
    return {
        "status": "ok",
        "service": "mase-v2-backend",
        "version": "0.1.0",
    }
