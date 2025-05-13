import "./ProfilePage.css";
import "./Responsive.css";
import { Typography, Box } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import LoadingPage from "../LoadingPage/LoadingPage.js";
import { uploadAvatar } from "../../services/awsService.js";
import {
  getUserData,
  logout,
  subscribeToAuthChanges,
} from "../../services/userService.js";
import SettingsIcon from "../../assets/SettingsIcon.svg";
import LogOutIcon from "../../assets/LogOutIcon.svg";
import GalleryIcon from "../../assets/GalleryIcon.svg";
import NavBar from "../../components/NavBar/NavBar";

const PROFILE_FIELDS = [
  { label: "Username", value: "username" },
  { label: "E-mail", value: "email" },
  { label: "BIO", value: "biography" },
];

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (user) => {
      if (user) {
        try {
          const data = await getUserData(user.uid);
          setUserData(data);
        } catch (error) {
          setMessage("Data not found, try again :(");
        }
        setLoading(false);
      } else {
        setMessage("Error");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  if (message) {
    return <div>{message}</div>;
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
    } catch (error) {
      console.error(error);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    try {
      const url = await uploadAvatar(selectedFile);
      setUserData((prevData) => ({
        ...prevData,
        avatarUrl: url,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box className="profilePageWrapper">
      <NavBar />

      <main>
        <Box className="avatarWrapper" onClick={handleAvatarClick}>
          <img
            src={userData?.avatarUrl}
            className="userAvatar"
            alt="User Avatar"
            draggable="false"
          />
          <div className="avatarOverlay">
            <img src={GalleryIcon} alt="Gallery" className="galleryIcon" />
          </div>
        </Box>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: "none" }}
        />

        <Box className="profileDetailsContainer">
          {PROFILE_FIELDS.map(({ label, value }) => (
            <Box key={label}>
              <Typography>
                <strong>{label}</strong>
              </Typography>
              <Typography>{userData[value]}</Typography>
            </Box>
          ))}
        </Box>

        <Box className="optionButtons">
          <Link to="/settings">
            <IconButton aria-label="settings" size="large">
              <img
                src={SettingsIcon}
                alt="Settings"
                style={{ width: "24px", height: "24px" }}
              />
            </IconButton>
          </Link>

          <IconButton aria-label="logout" size="large" onClick={handleLogout}>
            <img
              src={LogOutIcon}
              alt="Logout"
              style={{ width: "24px", height: "24px" }}
            />
          </IconButton>
        </Box>
      </main>
    </Box>
  );
}