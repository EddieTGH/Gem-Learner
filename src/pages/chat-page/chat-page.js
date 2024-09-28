import React, { useState } from 'react';

import './chat-page.css'; // Import the CSS for styling
import storeChat from '../../pages/database-example/db-store-chat';
import storeFlashcard from '../../pages/database-example/db-store-flashcard';
import NavigationBar from '../../components/NavigationBar/NavigationBar';

function ChatBot({ chat, user }) {
  const [inputValue, setInputValue] = useState('');
  const [promptResponses, setPromptResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [queryResponse, setQueryResponse] = useState({});

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      getResponseForGivenPrompt();
    }
  };

  // Create flashcard by querying again
  const addFlashcard = async () => {
    if (!queryResponse.query.trim() || !queryResponse.response.trim()) return;

    try {
      const userQuery =
        'Can you make one flashcard out of this query and response pair? It should be less than two sentences without formatting. Query: ' +
        queryResponse.query +
        ' $$$ Response: ' +
        queryResponse.response +
        '. Put $$$ in your response between the flashcard front and back.';
      setLoading(true);

      const result = await chat.sendMessage(userQuery);
      const generatedFlashcard = result.response.text();
      setLoading(false);

      const [front, back] = generatedFlashcard.split('$$$');
      const userId = user?.id;
      console.log('result', generatedFlashcard);
      await storeFlashcard(front, back, userId);
    } catch (error) {
      console.log(error);
      console.log('Generating flashcard went wrong');
      setLoading(false);
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
      setQueryResponse({ query: userQuery, response: response });

      setLoading(false);

      // Generate required variables for storing in Supabase
      const category = 'General'; // You can modify this based on context or content type
      const userId = user?.id; // You would replace this with actual userId, e.g., from a login session
      console.log(userId);
      const isFlashcard = false; // Modify this flag as needed for flashcard-related queries

      // Call the function to store chat in Supabase
      await storeChat(userQuery, response, category, userId, isFlashcard);
    } catch (error) {
      console.log(error);
      console.log('Something Went Wrong');
      setLoading(false);
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
              className={`response-text ${response.isUser ? 'user-query' : 'gemini-response'} ${index === 0 && !response.isUser ? 'fw-bold' : ''}`}
            >
              {console.log('here', response, index)}
              {response.text}
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
          <button onClick={addFlashcard} className="mx-2">
            Add Flashcard
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
