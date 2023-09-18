import React, { useState } from 'react';
import './WelcomePage.css';
import ChatWindow from './ChatWindow';
import moodLogo from './TheMood.png';

const WelcomePage = ({ user }) => {
  const [showChat, setShowChat] = useState(false);
  const [currentChatName, setCurrentChatName] = useState("");
  const [recentChats, setRecentChats] = useState(["Alice", "Bob", "Carol"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecentChats, setFilteredRecentChats] = useState(recentChats);
  const [chatMessages, setChatMessages] = useState({});

  const openChat = (chatName) => {
    setShowChat(true);
    setCurrentChatName(chatName);
  };

  const closeChat = () => {
    setShowChat(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    setRecentChats([...recentChats, searchQuery]);
    openChat(searchQuery);
  };

  const handleRecentChatSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setFilteredRecentChats(recentChats.filter(chatName => chatName.toLowerCase().includes(query)));
  };

  const handleNewMessageSend = (chatName, newMessage) => {
    setChatMessages(prevChatMessages => {
      const oldMessages = prevChatMessages[chatName] || [];
      const newMessages = [...oldMessages, newMessage];
      return { ...prevChatMessages, [chatName]: newMessages };
    });
  };

  return (
    <div className="welcome-container">
      <header className="welcome-header">
        <img className="app_logo" src={moodLogo} alt="Mood.io Logo" />
        <h1 className="welcome-title">Welcome, {user.displayName}</h1>
        <button className="new-chat-button" onClick={() => openChat("New Chat")}>New Chat</button>
      </header>
      <main className={`welcome-main ${showChat ? 'shrink' : ''}`}>
        <div className="chat-container">
          <h2 className="section-title">Recent Chats</h2>
          <input 
  type="text" 
  className="search-input"
  placeholder="Search Recent Chats..." 
  onChange={handleRecentChatSearch}
/>
          <ul className="chat-list">
            {filteredRecentChats.map((chatName) => (
              <li key={chatName} onClick={() => openChat(chatName)}>Chat with {chatName}</li>
            ))}
          </ul>
        </div>
      </main>
      <div className={`chat-window-container ${showChat ? 'fade-in' : 'fade-out'}`}>
        {showChat && (
          <ChatWindow 
            chatName={currentChatName}
            closeChat={closeChat}
            messages={chatMessages[currentChatName] || []}
            onMessageSend={handleNewMessageSend}
            searchInterface={currentChatName === "New Chat" && (
              <div className="chat-search-container">
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search for people..."
                />
                <button onClick={handleSearchSubmit}>Start Chat</button>
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default WelcomePage;
