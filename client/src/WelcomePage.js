import React, { useState, useEffect } from 'react';
import './WelcomePage.css';
import ChatWindow from './ChatWindow';
import moodLogo from './TheMood.png';
import { searchForUsers, createNewChat,sendMessageToChat, fetchUserChats, db, getUserByUID } from './firebase';
import { doc} from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";




const WelcomePage = ({ user }) => {
  const [showChat, setShowChat] = useState(false);
  const [currentChatName, setCurrentChatName] = useState("");
  const [recentChats, setRecentChats] = useState([{name: "Alice", id: "chatId1"}, {name: "Bob", id: "chatId2"}]);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatMessages, setChatMessages] = useState({});
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [refreshChats, setRefreshChats] = useState(false);
  const [unsubscribeFromChat, setUnsubscribeFromChat] = useState(null);

  

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
     console.log("chatData: ", chatData);
     setRecentChats(chatData);
     
    };
    
    fetchChats();
  }, [user.uid, refreshChats]);


  useEffect(() => {
    console.log("Updated recentChats: ", recentChats);
  }, [recentChats]);

  
  const openChat = (chatName) => {
    setShowChat(true);
    setCurrentChatName(chatName);
    
    const chat = recentChats.find(c => c.name === chatName);
    if (chat && chat.id) {
      const unsubscribe = fetchChatMessages(chat.id, chatName);
      setUnsubscribeFromChat(() => unsubscribe); // Store the unsubscribe function
    }
  };
  

  const closeChat = () => {
    setShowChat(false);
    if (unsubscribeFromChat) {
        unsubscribeFromChat(); // Unsubscribe from real-time updates
        setUnsubscribeFromChat(null); // Reset the unsubscribe function
    }
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
  

  const handleNewMessageSend = (chatName, newMessageText) => {
    // Create a new message object with senderId and text
    const newMessage = {
        senderId: user.uid,
        text: newMessageText
    };

    // Update local chat messages state
    setChatMessages(prevChatMessages => {
        const oldMessages = prevChatMessages[chatName] || [];
        const updatedMessages = [...oldMessages, newMessage];
        return { ...prevChatMessages, [chatName]: updatedMessages };
    });

    // Retrieve the chatId associated with chatName
    const chat = recentChats.find(c => c.name === chatName);
    const chatId = chat ? chat.id : null;

    if (chatId) {
        sendMessageToChat(chatId, newMessage); // Note that we're sending the message object now, not just the text
        fetchChatMessages(chatId, chatName);  // Fetch the updated messages
    }
  };

  const fetchChatMessages = (chatId, chatName) => {
    // Fetch messages from Firebase using chatId
    const chatDocRef = doc(db, 'chats', chatId);
    const unsubscribe = onSnapshot(chatDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const fetchedMessages = docSnapshot.data().messages || [];
        
        // Update chatMessages state
        setChatMessages(prevChatMessages => ({
            ...prevChatMessages,
            [chatName]: fetchedMessages
        }));
      } else {
        console.error("Chat with the given ID doesn't exist.");
      }
    });
  
    // Cleanup listener on component unmount
    return () => unsubscribe();
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
          <ul className="chat-list">
            {recentChats.map((chat) => (
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
            user={user}
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


/*
  const yourFirebaseFetchFunction = async (chatId) => {
    const chatDocRef = doc(db, 'chats', chatId);
    const chatSnapshot = await getDoc(chatDocRef);

    if (!chatSnapshot.exists()) {
        console.log("Chat with the given ID doesn't exist.");
        return [];
    }

    const chatData = chatSnapshot.data();
    const messages = chatData.messages || [];

    return messages;  // This will return your array of messages
  };
*/