import './AuthPage.css';

import { Box, Button, Typography, OutlinedInput } from "@mui/material";

import PinkSphere from "../../Assets/PinkSphereAuth.svg";
import BlackSphere from "../../Assets/BlackSphereAuth.svg";

export default function AuthPage() {
  return (
    <Box className = "authWrapper">
      <Box className = "sphereWrapper">
        <img src={PinkSphere} draggable="false" />
        <img src={BlackSphere} style={{position: "relative", top: "60px"}} draggable="false" />
      </Box>

      <Typography className = "welcomeBackLoginText">Welcome Back!</Typography>

      <Box className = "inputsWrapper">
        <input placeholder="E-mail" type='email' className='emailForm' />
        <input placeholder="Password" type='password' className='passForm' />
      </Box>

      <Button className='signInButton'>Sign In</Button>

      <Box className = "createAccountSuggest">
        <Typography>Don't have an account?</Typography>
        <Typography sx={{fontWeight: "bold"}}>Create a account</Typography>
      </Box>

      <Typography sx={{fontWeight: "bold", marginTop: "23px"}}>Forgot password?</Typography>
    </Box>
  );
}