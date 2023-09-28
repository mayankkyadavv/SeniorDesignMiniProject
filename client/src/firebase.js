import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, doc, getDoc, setDoc, addDoc, 
  query, collection, where, getDocs, updateDoc 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAXzKiB8yEziAL1x07ilD-J6mqheq6WUFA",
  authDomain: "seniordesignminiprojectbu.firebaseapp.com",
  projectId: "seniordesignminiprojectbu",
  storageBucket: "seniordesignminiprojectbu.appspot.com",
  messagingSenderId: "203441254082",
  appId: "1:203441254082:web:0887621eafb6470509d55b",
  measurementId: "G-3NLQRV2DVR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

const getUserByUID = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userRef);
    return userSnapshot.exists() ? userSnapshot.data() : null;
  } catch (error) {
    console.error("Error fetching user by UID:", error);
  }
};

const createUserInFirestore = async (uid, name, email) => {
  try {
    const userRef = doc(db, "users", uid);
    const user = { name, email };
    await setDoc(userRef, user);
  } catch (error) {
    console.error("Error creating user in Firestore:", error);
  }
};

const searchForUsers = async (searchTerm) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("name", "==", searchTerm));

    const querySnapshot = await getDocs(q);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ ...doc.data(), uid: doc.id });
    });

    if (users.length === 0) {
      const qEmail = query(usersRef, where("email", "==", searchTerm));
      const emailQuerySnapshot = await getDocs(qEmail);
      emailQuerySnapshot.forEach((doc) => {
        users.push({ ...doc.data(), uid: doc.id });
      });
    }

    return users;
  } catch (error) {
    console.error("Error searching for users:", error);
  }
};

const fetchUserChats = async (uid) => {
  try {
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where("members", "array-contains", uid));

    const querySnapshot = await getDocs(q);
    const chats = [];
    querySnapshot.forEach((doc) => {
      chats.push({ ...doc.data(), chatId: doc.id });
    });

    return chats;
  } catch (error) {
    console.error("Error fetching user chats:", error);
  }
};

const sendMessageToChat = async (chatId, message) => {
  try {
    const chatRef = doc(db, "chats", chatId);
    const chatDoc = await getDoc(chatRef);
    if (chatDoc.exists()) {
      const currentMessages = chatDoc.data().messages;
      const updatedMessages = [...currentMessages, message];
      await updateDoc(chatRef, { messages: updatedMessages });
    } else {
      console.error("Chat does not exist for ID:", chatId);
    }
  } catch (error) {
    console.error("Error sending message to chat:", error);
  }
};

const createNewChat = async (user1Id, user2Id) => {
  try {
    const chatsRef = collection(db, "chats");
    const membersHash = [user1Id, user2Id].sort().join('_');

    const q = query(chatsRef, where("membersHash", "==", membersHash));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].id;
    }

    const newChat = {
      members: [user1Id, user2Id],
      membersHash: membersHash,
      messages: []
    };
    const chatDocRef = await addDoc(chatsRef, newChat);
    return chatDocRef.id;
  } catch (error) {
    console.error("Error creating new chat:", error);
  }
};

export { 
  auth, db, getUserByUID, createUserInFirestore, 
  searchForUsers, fetchUserChats, sendMessageToChat, createNewChat 
};
