// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, addDoc } from "firebase/firestore";
import { query, collection, where, getDocs } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXzKiB8yEziAL1x07ilD-J6mqheq6WUFA",
  authDomain: "seniordesignminiprojectbu.firebaseapp.com",
  projectId: "seniordesignminiprojectbu",
  storageBucket: "seniordesignminiprojectbu.appspot.com",
  messagingSenderId: "203441254082",
  appId: "1:203441254082:web:0887621eafb6470509d55b",
  measurementId: "G-3NLQRV2DVR"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

// Helper Functions
const getUserByUID = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userSnapshot = await getDoc(userRef);
  return userSnapshot.exists() ? userSnapshot.data() : null;
};

const createUserInFirestore = async (uid, name, email) => {
  const userRef = doc(db, "users", uid);
  const user = { name, email };
  await setDoc(userRef, user);
};

const searchForUsers = async (searchTerm) => {
  const usersRef = collection(db, "users");

  // Searching by name or email
  const q = query(usersRef, where("name", "==", searchTerm));

  const querySnapshot = await getDocs(q);
  const users = [];
  querySnapshot.forEach((doc) => {
      users.push({ ...doc.data(), uid: doc.id });
  });

  if (users.length === 0) {
      // If no users found by name, try searching by email
      const qEmail = query(usersRef, where("email", "==", searchTerm));
      const emailQuerySnapshot = await getDocs(qEmail);
      emailQuerySnapshot.forEach((doc) => {
          users.push({ ...doc.data(), uid: doc.id });
      });
  }

  return users;
};


const fetchUserChats = async (uid) => {
  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, where("members", "array-contains", uid));
  
  const querySnapshot = await getDocs(q);
  const chats = [];
  
  querySnapshot.forEach((doc) => {
    chats.push({ ...doc.data(), chatId: doc.id });
  });

  return chats;
};

const sendMessageToChat = async (chatId, message) => {
  const chatRef = doc(db, "chats", chatId);
  const chatDoc = await getDoc(chatRef);
  if (chatDoc.exists()) {
      const currentMessages = chatDoc.data().messages;
      const updatedMessages = [...currentMessages, message];
      await updateDoc(chatRef, { messages: updatedMessages });
  } else {
      // Handle chat not existing
  }
};

const createNewChat = async (user1Id, user2Id) => {
  const chatsRef = collection(db, "chats");

  // Generate membersHash
  const membersHash = [user1Id, user2Id].sort().join('_');

  // Check if a chat with the same membersHash exists
  const q = query(chatsRef, where("membersHash", "==", membersHash));
  const querySnapshot = await getDocs(q);

  // If chat exists, return the existing chatId
  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].id;
  }

  // Otherwise, create a new chat
  const newChat = {
    members: [user1Id, user2Id],
    membersHash: membersHash,
    messages: []
  };
  const chatDocRef = await addDoc(chatsRef, newChat);
  return chatDocRef.id;  // Returns the ID of the newly created chat document
};



export { auth, db, getUserByUID, createUserInFirestore, searchForUsers, fetchUserChats, sendMessageToChat, createNewChat };
