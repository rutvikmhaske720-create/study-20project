from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from config import get_settings
from api import auth, groups, search, dashboard, doubts

settings = get_settings()

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LearnConnect API",
    description="A collaborative learning platform API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(groups.router)
app.include_router(search.router)
app.include_router(dashboard.router)
app.include_router(doubts.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
