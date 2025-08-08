# backend/app/main.py

import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from .dependencies import rate_limiter

# --- Configuration and Initialization ---

# Load environment variables from .env file
load_dotenv()

# Configure the Gemini API
# It's a good practice to handle the case where the API key might be missing.
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in environment variables.")
genai.configure(api_key=api_key)

# Initialize the generative model
# Using gemini-1.5-flash for its speed and cost-effectiveness.
model = genai.GenerativeModel('gemini-1.5-flash')

# Initialize FastAPI app
app = FastAPI(
    title="AskMe Bot API",
    description="A simple API to power an AI-powered chatbot.",
    version="1.0.0",
)

# --- CORS Middleware ---

# Configure Cross-Origin Resource Sharing (CORS) to allow the frontend
# to communicate with this backend.
# In a production environment, you should restrict the origins to your frontend's domain.
origins = [
    "http://localhost:3000",
    "http://localhost",
    "https://askme-ebon.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# --- Pydantic Models ---

# Define the request body structure for the /chat endpoint using Pydantic.
# This provides automatic data validation and documentation.
class ChatRequest(BaseModel):
    question: str

# --- API Endpoints ---

@app.get("/", tags=["Root"])
async def read_root():
    """
    Root endpoint to welcome users and confirm the API is running.
    """
    return {"message": "Welcome to the AskMe Bot API!"}


@app.post("/api/chat", dependencies=[Depends(rate_limiter)], tags=["Chat"])
async def handle_chat(request: ChatRequest):
    """
    Handles the main chat logic.

    - Receives a question from the user.
    - Applies a predefined prompt template.
    - Calls the Gemini API to get a response.
    - Returns the response to the user.
    """
    # 1. Validate the input
    if not request.question or not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    # 2. Apply the prompt logic as specified
    prompt = f"Answer like you're a helpful assistant. User's question: \"{request.question}\""

    try:
        # 3. Call the Gemini API
        # The generate_content method sends the prompt to the model.
        response = model.generate_content(prompt)

        # 4. Return the AI's response
        # We access the text part of the response.
        return {"response": response.text}

    except Exception as e:
        # 5. Handle potential errors from the API call
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while processing your request.")