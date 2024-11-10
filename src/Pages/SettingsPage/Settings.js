import "./Settings.css";
import "./Responsive.css";
import { Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

import BackArrow from "../../Assets/BackArrowIcon.svg";

export default function SettingsPage() {
  return (
    <Box className="settingsWrapper">
      <Box className="head">
        <Link to="/profile">
          <img src={BackArrow} className="arrow" />
        </Link>
        <Typography className="mainText">Settings</Typography>
      </Box>

      <Box className="changeBox">
        <Box className="changePasswordBox">
          <Typography className="changeText">Change password: </Typography>
          <input placeholder="Old password" type="password" />
          <input placeholder="New password" type="password" />
          <Button variant="contained" className="saveButton">
            Save
          </Button>
        </Box>

        <Box className="changeEmailBox">
          <Typography className="changeText">Change email: </Typography>
          <input placeholder="New email" type="email" />
          <input placeholder="Current password" type="password" />
          <Button variant="contained" className="saveButton">
            Save
          </Button>
        </Box>
      </Box>

      <footer>
        <Button variant="contained" className="deleteAccountButton">
          Delete account
        </Button>
      </footer>
    </Box>
  );
}