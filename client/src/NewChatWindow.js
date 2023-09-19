import React, { useState } from 'react';
import './NewChatWindow.css';
import { searchForUsers } from './firebase'; // Assuming this function exists in firebase.js

const NewChatWindow = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSearch = async () => {
    const users = await searchForUsers(searchQuery);
    setSearchResults(users);
  };

  const startNewChat = () => {
    if (!selectedUser) {
      alert('Please select a user from the dropdown first.');
      return;
    }
    // Logic to actually start a chat goes here...
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
        {searchResults.length > 0 && (
          <div className="dropdown-results">
            {searchResults.map(user => (
              <div key={user.uid} onClick={() => setSelectedUser(user)}>
                {user.name} ({user.email})
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedUser && (
        <div className="selected-user">
          {selectedUser.name} ({selectedUser.email})
          <button onClick={startNewChat}>Start Chat</button>
        </div>
      )}
      <div className="search-results">
        {searchResults.map(user => (
           <div key={user.uid} className="search-result">
               {user.name}
               <button onClick={() => setSelectedUser(user)}>Select</button>
           </div>
        ))}
      </div>
    </div>
  );
};

export default NewChatWindow;

