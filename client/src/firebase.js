// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { query, collection, where, getDocs } from "firebase/firestore";
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


// Export for use in other files
export { auth, db, getUserByUID, createUserInFirestore, searchForUsers };
