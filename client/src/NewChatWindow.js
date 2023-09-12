import React, { useState } from 'react';
import './NewChatWindow.css';

const NewChatWindow = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    // TODO: Implement actual search logic here
    console.log(`Searching for ${searchQuery}`);
  };

  return (
    <div className="new-chat-window">
      <div className="chat-header">
        <h3>New Chat</h3>
        <button onClick={onClose}>X</button>
      </div>
      <div className="chat-search">
        <input
          type="text"
          placeholder="Search for someone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="search-results">
        {/* Render search results here */}
      </div>
    </div>
  );
};

export default NewChatWindow;
