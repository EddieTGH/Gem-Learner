// frontend/src/pages/rag-page.js

import React, { useState } from 'react';
import axios from 'axios';
import './rag-page.css'; // Import the CSS for styling
import NavigationBar from '../../components/NavigationBar/NavigationBar'; // Include if needed

function RagPage() {
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
      // Add the user's message to the promptResponses array
      setPromptResponses((prevResponses) => [
        ...prevResponses,
        { text: userQuery, isUser: true },
      ]);
      setInputValue('');

      // Send the input value to the backend
      console.log('Input value:', userQuery);
      const response = await axios.post('http://localhost:5001/run-script', {
        input_value: userQuery,
      });
      const output = response.data.output;
      console.log('Backend response:', output);

      // Call the Gemini API
      const apiKeyGemini = process.env.REACT_APP_GEMINI_API_KEY;
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKeyGemini);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const userQuery2 =
        'Here is my users query: ' +
        userQuery +
        '. Here is the answer I want to provide the user: ' +
        output +
        '. If the answer is completely irrelevant to the question, communicate that there is no relevant information to the users question. If there is relevant information, Please correct the answer to remove any grammar, spelling, and syntax errors. Remove all bold formatting. Keep the answer to less than 500 characters with specific, relevant information that answers the question.';
      const result = await model.generateContent(userQuery2);
      const processedOutput = result.response;
      const processedResponse = processedOutput.text();

      // Add the bot's response to the promptResponses array
      setPromptResponses((prevResponses) => [
        ...prevResponses,
        { text: processedResponse, isUser: false },
      ]);
      setLoading(false);
    } catch (error) {
      console.error('There was an error running the script!', error);
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gradient-to-br from-[#1e1e1e] to-[#333333]">
      {/* Include NavigationBar if needed */}
      <NavigationBar />
      <div className="rag-chat-container">
        <div className="rag-chat-window">
          {promptResponses.map((response, index) => (
            <div
              key={index}
              className={`rag-response-text ${
                response.isUser ? 'rag-user-query' : 'rag-bot-response'
              }`}
            >
              {response.text}
            </div>
          ))}
          {loading && (
            <div className="rag-loading text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden text-white">Loading...</span>
              </div>
            </div>
          )}
        </div>

        <div className="rag-input-area">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress} // Trigger response on "Enter"
            placeholder="Enter Prompt Here"
            className="form-control bg-inherit text-white"
          />
          <button
            onClick={getResponseForGivenPrompt}
            className="btn btn-primary"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default RagPage;
