import "./MainPage.css";
import "./Responsive.css";
import Logo from "../../assets/Logo.svg";
import SpaceShip from "../../assets/MainPageSpaceShip.svg";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { MAIN_PAGE_CONTENT } from "../../constants/mainPageContent";

export default function MainPage() {
  const { mainText, description, button } = MAIN_PAGE_CONTENT;

  return (
    <Box className="wrapper">
      <header>
        <img src={Logo} draggable="false" height={"50"} alt="Logo" />
      </header>

      <main>
        <Typography className="mainText">
          {mainText.firstPart}{" "}
          <span style={{ color: "#AD49E1" }}>{mainText.highlightedPart}</span>
        </Typography>
        <Typography className="descriptionOfSite">
          {description}
        </Typography>

        <img
          src={SpaceShip}
          className="spaceShip"
          draggable="false"
          alt="Space Ship"
        />

        <Link to="/auth" style={{ textDecoration: "none" }}>
          <Button variant="contained" className="startButton">
            {button.getStarted}
          </Button>
        </Link>
      </main>
    </Box>
  );
}
