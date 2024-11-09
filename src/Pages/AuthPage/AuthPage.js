import "./AuthPage.css";
import "./Responsive.css";
import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import axios from "axios";

import PinkSphere from "../../Assets/PinkSphereAuth.svg";
import BlackSphere from "../../Assets/BlackSphereAuth.svg";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage("");
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords don't match :(");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const ipResponse = await axios.get("https://api.ipify.org?format=json");
      const ipAddress = ipResponse.data.ip;

      const localDate = new Date();
      const localDateString = localDate.toLocaleString();

      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
        created_at: localDateString,
        location: ipAddress,
        Biography: "",
        favoriteList: "",
        friendsList: "",
        avatarUrl: "",
        watchLaterList: "",
      });

      setMessage("Registration successful!");

      setTimeout(function () {
        window.location.href = "/profile";
      }, 1000);
    } catch (error) {
      setMessage(`Error: Invalid data, try again!`);
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("User data:", docSnap.data());
      }

      setMessage("Login successful!");

      setTimeout(function () {
        window.location.href = "/profile";
      }, 1000);
    } catch (error) {
      setMessage(`Error: Invalid data, try again!`);
    }
  };

  return (
    <Box className="authWrapper">
      <Box className="sphereWrapper">
        <img src={PinkSphere} alt="Pink Sphere" draggable="false" />
        <img
          src={BlackSphere}
          alt="Black Sphere"
          style={{ position: "relative", top: "60px" }}
          draggable="false"
        />
      </Box>

      <Typography className="welcomeBackLoginText">
        {isLogin ? "Welcome Back!" : "Sign Up"}
      </Typography>

      <Box className="inputsWrapper">
        {!isLogin && (
          <input
            placeholder="Username"
            className="usernameForm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}
        <input
          placeholder="E-mail"
          type="email"
          className="emailForm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          className="passForm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {!isLogin && (
          <input
            placeholder="Confirm Password"
            type="password"
            className="confirmPassForm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
      </Box>

      <Button
        className="signInButton"
        onClick={isLogin ? handleLogin : handleRegister}
      >
        {isLogin ? "Sign In" : "Register"}
      </Button>

      <Box className="createAccountSuggest">
        <Typography>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
        </Typography>
        <Typography
          onClick={toggleForm}
          sx={{ fontWeight: "bold", cursor: "pointer", color: "orange" }}
        >
          {isLogin ? "Create an account" : "Sign In"}
        </Typography>
      </Box>

      {isLogin && (
        <Typography
          sx={{ fontWeight: "bold", marginTop: "23px", color: "orange" }}
        >
          Forgot password?
        </Typography>
      )}

      {message && (
        <Typography
          sx={{
            marginTop: "15px",
            color: message.includes("successful") ? "green" : "red",
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
}