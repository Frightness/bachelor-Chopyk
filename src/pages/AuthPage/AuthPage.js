import "./AuthPage.css";
import "./Responsive.css";
import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { loginService } from "../../services/authService";
import { registerService } from "../../services/authService";
import PinkSphere from "../../assets/PinkSphereAuth.svg";
import BlackSphere from "../../assets/BlackSphereAuth.svg";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage("");
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setMessage({ success: false, message: "Passwords don't match" });
      return;
    }

    try {
      const user = await registerService(email, password, username);
      if (!user) {
        setMessage({ success: false, message: user.message });
        return;
      }

      setTimeout(function () {
        window.location.href = "/profile";
      }, 1000);
    } catch (error) {
      setMessage({ success: false, message: error.message });
    }
  };

  const handleLogin = async () => {
    try {
      const user = await loginService(email, password);

      if (!user.success) {
        setMessage(user);
        return;
      } else {
        setMessage(user);
        
        setTimeout(function () {
          window.location.href = "/profile";
        }, 1000);
      }
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
            color: message.success ? "green" : "red",
          }}
        >
          {message.message}
        </Typography>
      )}
    </Box>
  );
}