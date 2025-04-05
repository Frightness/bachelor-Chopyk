import "./Settings.css";
import "./Responsive.css";
import { Typography, Button, Box, Snackbar } from "@mui/material";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { auth } from "../../firebase";
import {
  updatePassword,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

import BackArrow from "../../assets/BackArrowIcon.svg";

export default function SettingsPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarOpen = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChangePassword = async () => {
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      handleSnackbarOpen("Password was changed successfully!", "success");
    } catch (error) {
      handleSnackbarOpen(`Error: something went wrong. Try again :(`, "error");
    }
  };

  const handleChangeEmail = async () => {
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updateEmail(user, newEmail);
      handleSnackbarOpen("Email was changed successfully!", "success");
    } catch (error) {
      handleSnackbarOpen(`Error: something went wrong. Try again :(`, "error");
    }
  };

  return (
    <Box className="settingsWrapper">
      <Box className="head">
        <Link to="/profile">
          <img src={BackArrow} className="arrow" alt="arrow" />
        </Link>
        <Typography className="mainText">Settings</Typography>
      </Box>

      <Box className="changeBox">
        <Box className="changePasswordBox">
          <Typography className="changeText">Change password:</Typography>
          <input
            placeholder="Old password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            placeholder="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button
            variant="contained"
            className="saveButton"
            onClick={handleChangePassword}
          >
            Save
          </Button>
        </Box>

        <Box className="changeEmailBox">
          <Typography className="changeText">Change email:</Typography>
          <input
            placeholder="New email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <input
            placeholder="Current password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Button
            variant="contained"
            className="saveButton"
            onClick={handleChangeEmail}
          >
            Save
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={100000000}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        ContentProps={{
          sx: {
            backgroundColor:
              snackbar.severity === "success" ? "#26AB2A" : "#E7254F",
            borderRadius: "10px",
          },
        }}
      />
    </Box>
  );
}