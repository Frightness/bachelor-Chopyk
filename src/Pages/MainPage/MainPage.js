import './MainPage.css';

import Logo from "../../Assets/Logo.svg";
import SpaceShip from "../../Assets/MainPageSpaceShip.svg";

import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function createStars() {
  const stars = [];
  for (let i = 0; i < 30; i++) {
    stars.push(
      <div
        key={i}
        className="star"
        style={{
          top: `${Math.random() * 100}vh`,
          left: `${Math.random() * 100}vw`,
          animationDuration: `${Math.random() * 10 + 5}s`,
          animationDelay: `${Math.random() * 5}s`,
        }}
      />
    );
  }
  return stars;
}

export default function MainPage() {
  return (
    <Box className="wrapper">
      <header>
        <img src={Logo} draggable="false" />
        <Box>
          <Typography style={{fontSize: "34px", fontWeight: "bold" }}>CINEMLY</Typography>
          <Typography style={{fontSize: "17px" }}>ENJOY TOGETHER</Typography>
        </Box>
      </header>

      <main>
        <Typography sx={{fontSize: "40px", maxWidth: "628px", zIndex: "10", fontWeight: "bold" }}>
          DISCOVER A UNIVERSE OF <span style={{ color: "#AD49E1" }}>VIDEO WITH FRIENDS</span>
        </Typography>
        <Typography sx={{ maxWidth: "560px", fontSize: "16px", marginTop: "25px", zIndex: "10" }}>
          We add variety and new emotions to virtual communication. 
          Join us and make sure that distance is no longer an obstacle to watching films with your friends
          or sharing happy family video memories!
        </Typography>

        <img src={SpaceShip} className="spaceShip" draggable="false" />

        <Link to="/auth" style={{ textDecoration: 'none' }}>
          <Button variant="contained" className="startButton">Get Started</Button>
        </Link>
      </main>

      <div className="flyingStars">{createStars()}</div>
    </Box>
  );
}
