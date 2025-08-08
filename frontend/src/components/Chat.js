// frontend/src/components/Chat.js

import React, { useState, useEffect, useRef } from 'react';

// --- Helper Components ---

// Simple loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
  </div>
);

// Component for displaying a single message bubble
const Message = ({ text, sender }) => {
  const isUser = sender === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-lg'
            : 'bg-gray-200 text-gray-800 rounded-bl-lg'
        }`}
      >
        <p className="text-sm">{text}</p>
      </div>
    </div>
  );
};

// Component for displaying recent questions
const RecentQuestions = ({ questions, onQuestionClick }) => {
  if (questions.length === 0) return null;
  return (
    <div className="mb-4 px-4">
        <h3 className="text-xs text-gray-500 font-semibold mb-2">Your Recent Questions</h3>
        <div className="flex flex-wrap gap-2">
            {questions.map((q, index) => (
                <button
                    key={index}
                    onClick={() => onQuestionClick(q)}
                    className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                >
                    {q}
                </button>
            ))}
        </div>
    </div>
  );
};


// --- Main Chat Component ---

const Chat = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentQuestions, setRecentQuestions] = useState([]);

  const chatEndRef = useRef(null);
  const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

  // --- Effects ---

  // Load recent questions from localStorage on initial render
  useEffect(() => {
    try {
        const storedQuestions = localStorage.getItem('recentQuestions');
        if (storedQuestions) {
            setRecentQuestions(JSON.parse(storedQuestions));
        }
    } catch (e) {
        console.error("Failed to parse recent questions from localStorage", e);
    }
  }, []);

  // Scroll to the latest message whenever the messages array changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Handlers ---

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    // Update and store recent questions
    updateRecentQuestions(input);

    try {
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: input }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Something went wrong');
      }

      const data = await response.json();
      const botMessage = { text: data.response, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);

    } catch (err) {
      const errorMessage = { text: `Error: ${err.message}`, sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRecentQuestions = (question) => {
    setRecentQuestions(prev => {
        const updated = [question, ...prev.filter(q => q !== question)].slice(0, 3);
        try {
            localStorage.setItem('recentQuestions', JSON.stringify(updated));
        } catch (e) {
            console.error("Failed to save recent questions to localStorage", e);
        }
        return updated;
    });
  };

  const handleRecentQuestionClick = (question) => {
    setInput(question);
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">AskMe Bot</h1>
        <p className="text-sm text-gray-500">Your helpful AI assistant</p>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <Message key={index} text={msg.text} sender={msg.sender} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-lg">
              <LoadingSpinner />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Recent Questions & Input Form */}
      <div className="border-t border-gray-200 bg-gray-50 p-2">
        <RecentQuestions questions={recentQuestions} onQuestionClick={handleRecentQuestionClick} />
        <form onSubmit={handleSubmit} className="flex items-center space-x-2 p-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your question..."
            className="flex-1 w-full px-4 py-2 text-sm bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;