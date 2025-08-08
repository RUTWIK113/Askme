// frontend/src/App.js
// This is the main container for the application.

import React from 'react';
import Chat from './components/Chat';
import './App.css'; // Using for background color and layout

function App() {
  return (
    <div className="App bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl h-full max-h-[700px]">
        <Chat />
      </div>
    </div>
  );
}

export default App;