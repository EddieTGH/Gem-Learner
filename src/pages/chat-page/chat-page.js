import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './chat-page.css';  // Import the CSS for styling

function ChatBot() {
  const [inputValue, setInputValue] = useState('');
  const [promptResponses, setPromptResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  const genAI = new GoogleGenerativeAI(
    "API KEY"
  );

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const getResponseForGivenPrompt = async () => {
    try {
      setLoading(true);
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(inputValue);
      setInputValue('');
      const response = result.response;
      const text = response.text();
      console.log(text);
      setPromptResponses([text, ...promptResponses]); // Adding new response at the top

      setLoading(false);
    } catch (error) {
      console.log(error);
      console.log("Something Went Wrong");
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        {loading ? (
          <div className="loading text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          promptResponses.map((promptResponse, index) => (
            <div key={index} className={`response-text ${index === 0 ? 'fw-bold' : ''}`}>
              {promptResponse}
            </div>
          ))
        )}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Ask Me Something You Want"
          className="form-control"
        />
        <button onClick={getResponseForGivenPrompt} className="btn btn-primary">Send</button>
      </div>
    </div>
  );
}

export default ChatBot;
