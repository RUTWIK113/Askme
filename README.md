# AskMe Bot - A Full-Stack AI Chat Application

AskMe Bot is a simple, responsive, and intelligent chatbot application. It features a React-based frontend and a Python FastAPI backend powered by the Google Gemini API.

## ✨ Features

  * **🤖 Intelligent Responses:** Integrates with Google's Gemini Pro model to provide helpful and conversational answers.
  * **⚡️ Fast & Modern Backend:** Built with FastAPI, offering high performance and automatic API documentation.
  * **🎨 Sleek Frontend:** A clean, responsive chat interface created with React.
  * **🛡️ Rate Limiting:** Simple IP-based rate limiting to prevent abuse (5 requests per 10 seconds).
  * **📜 Conversation History:** Remembers your most recent questions for easy reuse.
  * **⚙️ Easy Setup:** Fully containerized with clear instructions for getting started.

-----

## 🛠️ Tech Stack

| Component | Technology                                                              |
| :-------- | :---------------------------------------------------------------------- |
| **Backend** | Python, FastAPI, Uvicorn, Google Generative AI, Pydantic, python-dotenv |
| **Frontend** | React, JavaScript, CSS, react-markdown                                  |
| **API** | REST                                                                    |

-----

## 📂 Project Structure

```
askme-bot/
├── backend/
│   ├── app/
│   │   ├── dependencies.py # Rate limiting logic
│   │   └── main.py         # Main FastAPI application
│   ├── .env.example        # Example environment variables
│   ├── requirements.txt    # Python dependencies
│   └── uvicorn_runner.py   # Script to run the backend server
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   └── Chat.js     # The core chat component
    │   ├── App.js          # Main React component
    │   └── index.js        # React entry point
    └── package.json        # Node.js dependencies
```

-----

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

  * **Node.js & npm:** [Download & Install Node.js](https://nodejs.org/en/download/) (npm is included)
  * **Python:** Version 3.8+ and `pip` ([Download & Install Python](https://www.python.org/downloads/))
  * **Google Gemini API Key:** Get your key from [Google AI Studio](https://makersuite.google.com/app/apikey).

### Installation & Setup

#### 1\. Clone the Repository

```bash
git clone <your-repository-url>
cd askme-bot
```

#### 2\. Backend Setup

First, navigate to the backend directory and set up a virtual environment.

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install the required Python packages
pip install -r requirements.txt
```

Next, configure your environment variables.

1.  Create a file named `.env` in the `backend` directory.

2.  Copy the contents from a non-existent `.env.example` or add the following line:

    ```env
    # backend/.env
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
    ```

3.  Replace `"YOUR_GEMINI_API_KEY_HERE"` with your actual Google Gemini API key.

#### 3\. Frontend Setup

Open a new terminal window and navigate to the frontend directory.

```bash
# Navigate to the frontend directory
cd frontend

# Install the required npm packages
npm install
```

The frontend is configured to connect to the backend at `http://127.0.0.1:8000`. This can be changed by setting the `REACT_APP_API_URL` environment variable if needed.

### Running the Application

You'll need to run both the backend and frontend servers simultaneously in separate terminal windows.

1.  **Start the Backend Server:**

      * Make sure you are in the `backend` directory with your virtual environment (`venv`) activated.
      * Run the application using the provided Uvicorn runner script.

    <!-- end list -->

    ```bash
    python uvicorn_runner.py
    ```

    The API will be running at `http://127.0.0.1:8000`.

2.  **Start the Frontend Server:**

      * Make sure you are in the `frontend` directory.
      * Run the start script.

    <!-- end list -->

    ```bash
    npm start
    ```

    The application will open automatically in your browser at `http://localhost:3000`.

-----

## 📖 API Endpoints

The backend exposes the following endpoints:

  * **`GET /`**

      * **Description:** A welcome endpoint to confirm the API is running.
      * **Response:**
        ```json
        {
          "message": "Welcome to the AskMe Bot API!"
        }
        ```

  * **`POST /api/chat`**

      * **Description:** The main endpoint for sending a question to the AI model.
      * **Request Body:**
        ```json
        {
          "question": "What is FastAPI?"
        }
        ```
      * **Success Response (200):**
        ```json
        {
          "response": "FastAPI is a modern, fast (high-performance), web framework for building APIs with Python 3.7+ based on standard Python type hints..."
        }
        ```
      * **Error Response (429):**
        ```json
        {
          "detail": "Rate limit exceeded. Try again later."
        }
        ```