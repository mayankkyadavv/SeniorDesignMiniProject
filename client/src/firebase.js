// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwdVgpV_4BI69N1DUK1gUCBDPioXg8uAs",
  authDomain: "senior-design-mini-proje-99bf6.firebaseapp.com",
  projectId: "senior-design-mini-proje-99bf6",
  storageBucket: "senior-design-mini-proje-99bf6.appspot.com",
  messagingSenderId: "836513863851",
  appId: "1:836513863851:web:8385d51917cdb5a7b2ffee",
  measurementId: "G-Q2LPFE78KJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Export for use in other files
export { auth };
