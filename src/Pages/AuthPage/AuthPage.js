import './AuthPage.css';
import { Box, Button, Typography, OutlinedInput } from "@mui/material";
import React, { useState } from 'react';

import PinkSphere from "../../Assets/PinkSphereAuth.svg";
import BlackSphere from "../../Assets/BlackSphereAuth.svg";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };
  
  return (
    <Box className="authWrapper">
      <Box className="sphereWrapper">
        <img src={PinkSphere} alt="Pink Sphere" draggable="false" />
        <img src={BlackSphere} alt="Black Sphere" style={{ position: "relative", top: "60px" }} draggable="false" />
      </Box>

      <Typography className="welcomeBackLoginText">
        {isLogin ? "Welcome Back!" : "Sign Up"}
      </Typography>

      <Box className="inputsWrapper">
        {!isLogin && (
          <input placeholder="Username" className="usernameForm" />
        )}
        <input placeholder="E-mail" type="email" className="emailForm" />
        <input placeholder="Password" type="password" className="passForm" />
        {!isLogin && (
          <input placeholder="Confirm Password" type="password" className="confirmPassForm" />
        )}
      </Box>

      <Button className="signInButton">
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
        <Typography sx={{ fontWeight: "bold", marginTop: "23px", color: "orange" }}>
          Forgot password?
        </Typography>
      )}
    </Box>
  );
}
