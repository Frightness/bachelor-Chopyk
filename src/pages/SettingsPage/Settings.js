import "./Settings.css";
import "./Responsive.css";
import { Typography, Box, Snackbar } from "@mui/material";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import BackArrow from "../../assets/BackArrowIcon.svg";
import { changeUserPassword, changeUserEmail } from "../../services/settingsService";
import SettingsForm from "../../components/SettingsForm/SettingsForm";

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
    const result = await changeUserPassword(oldPassword, newPassword);
    if (result.success) {
      setOldPassword("");
      setNewPassword("");
    }
    handleSnackbarOpen(result.message, result.success ? "success" : "error");
  };

  const handleChangeEmail = async () => {
    const result = await changeUserEmail(newEmail, currentPassword);
    if (result.success) {
      setNewEmail("");
      setCurrentPassword("");
    }
    handleSnackbarOpen(result.message, result.success ? "success" : "error");
  };

  const passwordFields = [
    {
      name: "oldPassword",
      placeholder: "Old password",
      type: "password",
      value: oldPassword,
      onChange: (e) => setOldPassword(e.target.value),
    },
    {
      name: "newPassword",
      placeholder: "New password",
      type: "password",
      value: newPassword,
      onChange: (e) => setNewPassword(e.target.value),
    },
  ];

  const emailFields = [
    {
      name: "newEmail",
      placeholder: "New email",
      type: "email",
      value: newEmail,
      onChange: (e) => setNewEmail(e.target.value),
    },
    {
      name: "currentPassword",
      placeholder: "Current password",
      type: "password",
      value: currentPassword,
      onChange: (e) => setCurrentPassword(e.target.value),
    },
  ];

  return (
    <Box className="settingsWrapper">
      <Box className="head">
        <Link to="/profile">
          <img src={BackArrow} className="arrow" alt="arrow" />
        </Link>
        <Typography className="mainText">Settings</Typography>
      </Box>

      <Box className="changeBox">
        <SettingsForm
          title="Change password:"
          fields={passwordFields}
          onSubmit={handleChangePassword}
        />

        <SettingsForm
          title="Change email:"
          fields={emailFields}
          onSubmit={handleChangeEmail}
        />
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