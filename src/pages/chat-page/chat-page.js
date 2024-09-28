import React, { useState } from 'react';
import './chat-page.css';

function ChatBot({ chat }) {
  const [inputValue, setInputValue] = useState('');
  const [promptResponses, setPromptResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      getResponseForGivenPrompt();
    }
  };

  const getResponseForGivenPrompt = async () => {
    if (!inputValue.trim()) return;

    try {
      const userQuery = inputValue;
      setLoading(true);
      setPromptResponses([{ text: userQuery, isUser: true }, ...promptResponses]);
      setInputValue('');

      const result = await chat.sendMessage(userQuery);
      const response = result.response.text();

      setPromptResponses([{ text: response, isUser: false }, { text: userQuery, isUser: true }, ...promptResponses]);
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
        {loading && (
          <div className="loading text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {promptResponses.map((response, index) => (
          <div key={index} className={`response-text ${response.isUser ? 'user-query' : 'gemini-response'} ${index === 0 && !response.isUser ? 'fw-bold' : ''}`}>
            {response.text}
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Ask Me Something You Want"
          className="form-control"
        />
        <button onClick={getResponseForGivenPrompt} className="btn btn-primary">Send</button>
      </div>
    </div>
  );
}

export default ChatBot;