// src/App.js

import React, { useState } from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Link, 
  Outlet,
  Navigate
} from 'react-router-dom';
import './App.css';
import moodLogo from './TheMood.png'; // Import the logo
import { auth, getUserByUID, createUserInFirestore } from './firebase';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import WelcomePage from './WelcomePage';

const App = () => {
  const [user, setUser] = useState(null);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);

      // Check if the user exists in Firestore
      const existingUser = await getUserByUID(user.uid);

      // If the user doesn't exist, create a new document for them in Firestore
      if (!existingUser) {
        await createUserInFirestore(user.uid, user.displayName, user.email);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={ user ? <Navigate to="/welcome" /> : (
              <>
                <h1>Login Page</h1>
                <img className="app-logo" src={moodLogo} alt="Mood.io Logo" />
                <p>Welcome, please sign in below.</p>
                <div className="google-signin" onClick={handleGoogleLogin}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="google logo" />
                  <span>Sign in with Google</span>
                </div>
              </>
            )} 
          />
          <Route path="/welcome" element={ user ? <WelcomePage user={user} /> : <Navigate to="/" /> } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

