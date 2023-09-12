import React, { useState } from 'react';
import './ChatWindow.css';

const ChatWindow = ({ chatName, closeChat, searchInterface, messages, onMessageSend }) => {
  const [newMessage, setNewMessage] = useState("");

  const handleNewMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = () => {
    onMessageSend(chatName, newMessage);
    setNewMessage("");
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>{chatName}</h3>
        <button onClick={closeChat}>X</button>
      </div>
      {searchInterface && (
        <div className="chat-search-container">
          {searchInterface}
        </div>
      )}
     <div className="chat-messages">
  {messages.map((message, index) => (
    <div key={index}> {/* New block-level div */}
      <div className="sent-message">{message}</div>
    </div>
  ))}
</div>

      <div className="chat-input">
        <input 
          type="text" 
          placeholder="Type a message..." 
          value={newMessage}
          onChange={handleNewMessageChange}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
