import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

import './chat-page.css'; // Import the CSS for styling
import storeChat from '../../pages/database-example/db-store-chat';
import storeFlashcard from '../../pages/database-example/db-store-flashcard';
import NavigationBar from '../../components/NavigationBar/NavigationBar';

function ChatBot({ chat, user }) {
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
      setPromptResponses([
        { text: userQuery, isUser: true },
        ...promptResponses,
      ]);
      setInputValue('');
      const result = await chat.sendMessage(userQuery);
      const response = result.response.text();

      setPromptResponses([
        { text: response, isUser: false },
        { text: userQuery, isUser: true },
        ...promptResponses,
      ]);

      setLoading(false);

      // Generate required variables for storing in Supabase
      const category = await getCategory(userQuery); // You can modify this based on context or content type
      console.log(category);
      const userId = user?.id; // You would replace this with actual userId, e.g., from a login session
      console.log(userId);
      const isFlashcard = true; // Modify this flag as needed for flashcard-related queries

      // Call the function to store chat in Supabase
      await storeChat(userQuery, response, category, userId, isFlashcard);

      // Conditionally store flashcard when `isFlashcard` is true
      if (isFlashcard) {
        await storeFlashcard(userQuery, response, userId);
      }
    } catch (error) {
      console.log(error);
      console.log('Something Went Wrong');
      setLoading(false);
    }
  };

  const getCategory = async (userQuery) => {
    try {
      // Call the Gemini API
      const apiKeyGemini = process.env.REACT_APP_GEMINI_API_KEY;
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKeyGemini);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const userQuery2 =
        'Here is my user query: ' +
        userQuery +
        '. If academically related, please provide me with the subject in one/two words. Some examples include Computer Science, Math, Biology, Physics, History, Language, Music, Business, etc. If not academically related, please output the label "Other". Do not provide any other information.';
      const result = await model.generateContent(userQuery2);
      const response = result.response;
      const category = response.text();
      //console.log(category);
      return category;
    } catch (error) {
      console.log(error);
      console.log('Something Went Wrong');
      setLoading(false);
      return null;
    }
  };

  return (
    <div className="flex">
      <NavigationBar />
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
            <div
              key={index}
              className={`response-text ${response.isUser ? 'user-query' : 'gemini-response'}`}
            >
              {response.isUser ? (
                response.text
              ) : (
                <ReactMarkdown>{response.text}</ReactMarkdown>
              )}
            </div>
          ))}
        </div>

        <div className="input-area">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress} // Trigger response on "Enter"
            placeholder="Ask Me Something You Want"
            className="form-control"
          />
          <button
            onClick={getResponseForGivenPrompt}
            className="btn btn-primary"
          >
            Send
          </button>
          <button className="mx-2">Add Flashcard</button>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
