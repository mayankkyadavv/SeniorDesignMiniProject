import React, { useState, useEffect } from 'react';
import './WelcomePage.css';
import ChatWindow from './ChatWindow';
import moodLogo from './TheMood.png';
import { searchForUsers, createNewChat, sendMessageToChat, fetchUserChats, getUserByUID } from './firebase';



const WelcomePage = ({ user }) => {
  const [showChat, setShowChat] = useState(false);
  const [currentChatName, setCurrentChatName] = useState("");
  const [recentChats, setRecentChats] = useState([{name: "Alice", id: "chatId1"}, {name: "Bob", id: "chatId2"}]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecentChats, setFilteredRecentChats] = useState(recentChats);
  const [chatMessages, setChatMessages] = useState({});
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [refreshChats, setRefreshChats] = useState(false);

  

  useEffect(() => {
    const fetchChats = async () => {
      const userChats = await fetchUserChats(user.uid);
      console.log("Fetched chats: ", userChats);
      // Extract the chat names and IDs to display
      const chatPromises = userChats.map(async chat => {
        const otherUser = chat.members.find(memberId => memberId !== user.uid);
        console.log('otherUser: ', otherUser);
        const otherUserName = await getUserByUID(otherUser);
        console.log('otherUsername: ', otherUserName);
        return {name: otherUserName.name, id: chat.chatId}; 
     });
     
     const chatData = await Promise.all(chatPromises);
     setRecentChats(chatData);
     
    };
    
    fetchChats();
  }, [user.uid, refreshChats]);
  
  const openChat = (chatName) => {
    setShowChat(true);
    setCurrentChatName(chatName);
  };

  const closeChat = () => {
    setShowChat(false);
  };

  const handleSearchChange = async (e) => {
    setSearchQuery(e.target.value);
    if(e.target.value.trim() !== "") {
      const usersFound = await searchForUsers(e.target.value);
      setSearchedUsers(usersFound);
    } else {
      setSearchedUsers([]); // Clear the results if search input is empty
    }
  };

  const handleSearchSubmit = async () => {
    const usersFound = await searchForUsers(searchQuery);
  
    if (usersFound.length > 0) {
      const chatName = usersFound[0].name;
      const chatId = await createNewChat(user.uid, usersFound[0].uid);
      setRecentChats([...recentChats, {name: chatName, id: chatId}]);
      openChat(chatName);
    } else {
      alert("User not found!");
    }
    setRefreshChats(prevState => !prevState);
  };
  

  const handleRecentChatSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setFilteredRecentChats(recentChats.filter(chat => chat.name.toLowerCase().includes(query)));
  };

  const handleNewMessageSend = (chatName, newMessage) => {
    // Update local chat messages state
    setChatMessages(prevChatMessages => {
      const oldMessages = prevChatMessages[chatName] || [];
      const newMessages = [...oldMessages, newMessage];
      return { ...prevChatMessages, [chatName]: newMessages };
    });
  
    // Retrieve the chatId associated with chatName.
    const chat = recentChats.find(c => c.name === chatName);
    const chatId = chat ? chat.id : null;
  
    if (chatId) {
      sendMessageToChat(chatId, newMessage);
    }
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
            {filteredRecentChats.map((chat) => (
              <li key={chat.id} onClick={() => openChat(chat.name)}>Chat with {chat.name}</li>
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
                {/* Conditionally render dropdown list for the searched users */}
                {searchedUsers.length > 0 && (
                  <div className="search-dropdown">
                    {searchedUsers.map(user => (
                      <div 
                        key={user.uid}
                        onClick={() => {
                          setSearchQuery(user.name);
                          setSearchedUsers([]);  // Clear the dropdown after selecting a user
                        }}
                      >
                        {user.name}
                      </div>
                    ))}
                  </div>
                )}
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