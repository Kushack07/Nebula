from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router

app = FastAPI(title="Nebula API Service")

# Configure CORS so the React frontend can call this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, restrict this to the Vite frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1/nebula")

@app.get("/")
async def root():
    return {"message": "Welcome to Nebula API Service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
