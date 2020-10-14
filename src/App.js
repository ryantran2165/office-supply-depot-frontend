import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "./components/navigation/navigation";

const IS_LOCAL = false;
const API = IS_LOCAL
  ? "http://localhost:8000"
  : "https://office-supply-depot-backend.herokuapp.com";

function App() {
  // Start signed in if token exists, useEffect will check expiration
  const [signedIn, setSignedIn] = useState(
    localStorage.getItem("token") ? true : false
  );
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    // On refresh/load, check if token is expired
    if (signedIn) {
      axios(`${API}/users/current-user/`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          // Token not expired, set user
          setUser(res.data);
        })
        .catch((res) => {
          // Token expired, force sign out
          setSignedIn(false);
        });
    }
  }, [signedIn]);

  function handleSignIn(e, data) {
    // Prevent default form behavior
    e.preventDefault();

    axios
      .post(`${API}/token-auth/`, data)
      .then((res) => {
        // Sign in success, save token and state
        localStorage.setItem("token", res.data.token);
        setSignedIn(true);
        setUser(res.data.user);
      })
      .catch((err) => {
        // Invalid email/password
        const error = err.response.data.non_field_errors[0];
        if (error === "Unable to log in with provided credentials.") {
          alert("Invalid email/password, please try again.");
        }
      });
  }

  function handleSignUp(e, data) {
    // Prevent default form behavior
    e.preventDefault();

    axios
      .post(`${API}/users/user-list/`, data)
      .then((res) => {
        // Sign up success, save token and state
        localStorage.setItem("token", res.data.token);
        setSignedIn(true);
        setUser(res.data);
      })
      .catch((err) => {
        // User with email already exists
        const error = err.response.data.email[0];
        if (error === "user with this email address already exists.") {
          alert("User with this email already exists, please try again.");
        }
      });
  }

  function handleSignOut() {
    // Delete token and reset state
    localStorage.removeItem("token");
    setSignedIn(false);
    setUser(undefined);
  }

  return (
    <Navigation
      signedIn={signedIn}
      user={user}
      handleSignIn={handleSignIn}
      handleSignUp={handleSignUp}
      handleSignOut={handleSignOut}
    />
  );
}

export default App;
