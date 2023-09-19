import React, { useState, useRef, useEffect } from 'react';
import './ChatWindow.css';

const ChatWindow = ({ chatName, closeChat, searchInterface, messages, onMessageSend }) => {
  console.log("chatName-chatWindow: ", chatName);
  console.log("closeChat-closeChat: ", closeChat);
  console.log("searchInterface-closeChat: ", searchInterface);
  console.log("messages-ChatWindow: ", messages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null); // new

  const scrollToBottom = () => { // new function
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { // new useEffect
    scrollToBottom();
  }, [messages]);

  const handleNewMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = () => {
    onMessageSend(chatName, newMessage);
    setNewMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
      e.preventDefault();  
    }
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
        <div key={index}>
            <div className="sent-message">{message}</div>
        </div>
    ))}
    <div ref={messagesEndRef}></div>  {/* new */}
</div>
      <div className="chat-input">
        <input 
          type="text" 
          placeholder="Type a message..." 
          value={newMessage}
          onChange={handleNewMessageChange}
          onKeyDown={handleKeyDown}  

        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
