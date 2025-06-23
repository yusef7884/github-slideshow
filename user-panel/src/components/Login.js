import React from 'react';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from '../firebaseConfig';

function Login({ onLoginSuccess }) {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // This gives you a Google Access Token. You can use it to access the Google API.
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log("Logged in user:", user);
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } catch (error) {
      // Handle Errors here.
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // The email of the user's account used.
      // const email = error.customData.email;
      // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
      console.error("Error during Google sign-in:", error);
      // You might want to display an error message to the user here
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome to the Learner Panel</h2>
      <p>Please sign in to continue.</p>
      <button onClick={handleGoogleLogin} className="login-button">
        <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google sign-in" className="google-icon" />
        Sign in with Google
      </button>
    </div>
  );
}

export default Login;
