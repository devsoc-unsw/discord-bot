import uvicorn
import os
import dotenv

dotenv.load_dotenv()

def main():
    uvicorn.run(
        "backend.main:app",
        host=os.getenv("UVICORN_HOST", "127.0.0.1"),
        reload=os.getenv("UVICORN_RELOAD", "false").lower() == "true",
        port=int(os.getenv("UVICORN_PORT", 8000)),
        app_dir="src"
    )

if __name__ == "__main__":
    main()