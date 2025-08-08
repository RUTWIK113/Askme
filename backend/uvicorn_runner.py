# backend/uvicorn_runner.py
# This script is a convenient way to run the FastAPI app.

import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True, # The server will restart on code changes
        log_level="info"
    )