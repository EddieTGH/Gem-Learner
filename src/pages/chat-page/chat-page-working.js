// chat-bot.js
import React, { useState } from 'react';
import './chat-page.css';  // Import the CSS for styling
import { GoogleGenerativeAI } from '@google/generative-ai';  // Import the Google Gemini API package

function ChatBot() {
  const [messages, setMessages] = useState([]);  // Stores the conversation
  const [input, setInput] = useState('');        // Stores the user's input
  const [loading, setLoading] = useState(false); // Loading state for API requests

  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;  // Make sure your API key is in .env file
  const genAI = new GoogleGenerativeAI(apiKey);  // Initialize the Gemini API

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);  // Add user message to chat
    setInput('');  // Clear input field
    setLoading(true);  // Set loading state

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });  // Initialize the model
      const result = await model.generateContent({ prompt: { text: input } });  // Make API call with user input
      const botMessage = { sender: 'bot', text: result.response.text };  // Extract the response text from the API
      setMessages((prevMessages) => [...prevMessages, botMessage]);  // Add bot response to chat
    } catch (error) {
      console.error('Error fetching Gemini response:', error);
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
    } finally {
      setLoading(false);  // Reset loading state
    }
  };

  // Handle Enter key for message submission
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-bot-container">
      <div className="chat-bot-header">Gemini Chatbot</div>

      <div className="chat-bot-box">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-bot-message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="chat-bot-loading">Gemini is thinking...</div>}
      </div>

      <div className="chat-bot-input-container">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBot;
