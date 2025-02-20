import "./ProfilePage.css";
import "./Responsive.css";
import { Typography, Box, Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import { signOut } from "firebase/auth";
import LoadingPage from "../../pages/LoadingPage/LoadingPage.js";
import { uploadAvatar } from "../../services/awsService.js";
import OutlinedInput from '@mui/material/OutlinedInput';

import EditProfileIcon from "../../assets/EditProfileIcon.svg";
import SettingsIcon from "../../assets/SettingsIcon.svg";
import LogOutIcon from "../../assets/LogOutIcon.svg";
import CloseWindowIcon from "../../assets/CloseWindowIcon.svg";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadURL, setUploadURL] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          setMessage("User data not found.");
        }
        setLoading(false);
      } else {
        setMessage("No user is logged in.");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  if (loading) {
    return <LoadingPage />;
  }

  if (message) {
    return <div>{message}</div>;
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    try {
      const url = await uploadAvatar(selectedFile);
      setUploadURL(url);
      window.location.reload();
    } catch (error) {
      alert("Avatar uploading failed");
      console.error(error);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    try {
      const url = await uploadAvatar(file);
      setUploadURL(url);
      alert("File uploaded successfully!");
      window.location.reload();
    } catch (error) {
      alert("File upload failed, see console for details.");
      console.error(error);
    }
  };

  return (
    <Box className="profilePageWrapper">
      <nav>
        <Link to={"/profile"} className="navItem profileNavItem">
          <svg
            width="25"
            height="25"
            viewBox="0 0 49 49"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24.5 0.0125656C18.2066 -0.198707 12.0917 2.26135 7.49819 6.85255C2.90463 11.4438 0.207847 17.7908 0 24.5C0.207847 31.2092 2.90463 37.5563 7.49819 42.1475C12.0917 46.7387 18.2066 49.1987 24.5 48.9874C30.7934 49.1987 36.9083 46.7387 41.5018 42.1475C46.0954 37.5563 48.7922 31.2092 49 24.5C48.7922 17.7908 46.0954 11.4438 41.5018 6.85255C36.9083 2.26135 30.7934 -0.198707 24.5 0.0125656ZM45.0494 22.2145L41.2825 21.235C40.5169 21.0065 40.4556 20.9412 40.3944 20.8432C39.935 20.1902 39.4144 19.3087 38.9244 18.4598C38.9244 18.1659 38.5263 17.7088 38.4344 17.4476C38.3425 17.1864 39.5063 15.4886 39.9963 14.705C40.5235 14.1184 41.133 13.6227 41.8031 13.2358C43.5802 15.8877 44.6972 18.977 45.0494 22.2145ZM24.5 4.0938L24.2244 4.64885C24.1984 4.54178 24.1984 4.42943 24.2244 4.32235C24.2244 4.51825 23.765 4.8121 23.4587 5.1386L22.54 6.08545C22.121 6.55116 21.8673 7.158 21.8226 7.80156C21.7779 8.44513 21.9449 9.08519 22.295 9.61164H21.9275C21.4439 9.62654 20.9697 9.75758 20.5402 9.99501C20.1107 10.2324 19.737 10.5701 19.4469 10.9829C19.1083 11.4804 18.8777 12.052 18.7717 12.6562C18.6658 13.2604 18.6872 13.8822 18.8344 14.4765V14.705C18.3877 14.7899 17.9475 14.91 17.5175 15.0642L16.7825 15.3254L14.8225 16.011C14.2385 16.1934 13.7061 16.5275 13.2732 16.9834C12.8402 17.4393 12.5202 18.0027 12.3419 18.623C12.1994 19.1436 12.1808 19.6937 12.2878 20.2239C12.3947 20.754 12.6238 21.2474 12.9544 21.6595C14.182 23.0717 15.6077 24.2722 17.1806 25.2183C18.7224 26.3097 20.4669 27.0336 22.295 27.3405H27.44C28.0596 27.309 28.6765 27.4451 29.2334 27.7363C29.7903 28.0274 30.2691 28.4641 30.625 29.0057C30.7916 29.1889 30.9146 29.4119 30.9839 29.6562C31.0531 29.9004 31.0666 30.1587 31.0231 30.4096C30.9585 30.8244 30.8009 31.2164 30.5637 31.5524C29.0378 32.8794 28.0061 34.7434 27.6544 36.809C27.2586 38.344 26.7675 39.8492 26.1844 41.3147C25.8169 42.3269 25.48 43.3064 25.235 44.0899C24.2076 44.1698 23.1749 44.0817 22.1725 43.8288C22.4165 41.4029 21.8763 38.9609 20.6412 36.907C19.6113 35.6096 19.0374 33.9702 19.0181 32.2707C19.216 30.6584 18.8727 29.0235 18.0488 27.6552C17.2249 26.2868 15.9736 25.2733 14.5162 24.7938C11.0872 22.5226 8.07721 19.6012 5.635 16.1743C7.4048 12.4809 10.1109 9.39095 13.4457 7.25544C16.7805 5.11994 20.6104 4.02456 24.5 4.0938ZM3.82812 24.5C3.82665 23.2273 3.94982 21.958 4.19563 20.7126C6.71017 23.9201 9.76359 26.5996 13.1994 28.6139C15.0369 29.3322 15.3125 30.0831 15.3125 32.2707C15.3193 34.9998 16.2552 37.6334 17.9463 39.6822C18.3979 41.0985 18.5444 42.605 18.375 44.0899C14.2821 42.9551 10.6477 40.4287 8.02265 36.8936C5.39763 33.3586 3.92506 29.0076 3.82812 24.5ZM29.3081 44.3511C29.3081 43.8614 29.6756 43.3064 29.8594 42.784C30.5582 41.0965 31.1217 39.3489 31.5438 37.56C31.7836 36.4526 32.3661 35.4635 33.1975 34.7521C34.2719 33.6308 34.8974 32.1097 34.9431 30.5076C34.9825 29.7482 34.875 28.9882 34.6274 28.2749C34.3798 27.5616 33.9973 26.9102 33.5037 26.361C32.7671 25.3976 31.8301 24.6304 30.7669 24.1203C29.7037 23.6103 28.5436 23.3713 27.3787 23.4226H22.5094C20.2236 22.7584 18.1223 21.515 16.3844 19.7984L17.8238 19.276L18.6506 19.0148C19.0152 18.8384 19.4148 18.7599 19.8144 18.7863L20.09 19.276C20.3192 19.7342 20.7002 20.0851 21.1588 20.2601C21.6174 20.4352 22.1207 20.4219 22.5706 20.2229C23.016 20.0013 23.3688 19.612 23.561 19.1297C23.7533 18.6475 23.7714 18.1065 23.6119 17.6109V17.0232C23.275 16.0437 22.8769 14.6724 22.6319 13.7582C23.4262 13.7937 24.2145 13.5964 24.911 13.1877C25.6076 12.779 26.1857 12.1745 26.5825 11.44C26.7726 10.8929 26.8218 10.3015 26.7248 9.72734C26.6279 9.15313 26.3884 8.61712 26.0312 8.17504C26.3919 7.83052 26.7296 7.45958 27.0419 7.06495C27.323 6.70634 27.5286 6.28758 27.6448 5.83696C27.7611 5.38634 27.7852 4.91437 27.7156 4.45295C31.9962 5.12475 35.982 7.17534 39.1387 10.3299C38.2119 10.9333 37.3928 11.7071 36.7194 12.6154C35.9886 13.7513 35.3337 14.9405 34.7594 16.1743C34.5123 16.9353 34.4502 17.7507 34.5787 18.5444C34.7072 19.338 35.0222 20.0839 35.4944 20.7126C36.0456 21.7248 36.6581 22.7043 37.2094 23.5205C37.9692 24.5415 39.0633 25.2181 40.2719 25.4142C40.9456 25.6101 43.3344 26.1325 45.0187 26.4916C44.4772 30.8447 42.6709 34.9078 39.8533 38.1109C37.0357 41.3139 33.3481 43.496 29.3081 44.3511Z"
              fill="#9E7AFF"
            />
          </svg>
          Profile
        </Link>

        <Link to={"/rooms"} className="navItem">
          <svg
            width="25"
            height="25"
            viewBox="0 0 49 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.44444 0C2.44149 0 0 2.44149 0 5.44444V29.9444C0 32.9474 2.44149 35.3889 5.44444 35.3889H20.4167L19.5064 38.1111H13.6111C12.1054 38.1111 10.8889 39.3276 10.8889 40.8333C10.8889 42.3391 12.1054 43.5556 13.6111 43.5556H35.3889C36.8946 43.5556 38.1111 42.3391 38.1111 40.8333C38.1111 39.3276 36.8946 38.1111 35.3889 38.1111H29.4936L28.5833 35.3889H43.5556C46.5585 35.3889 49 32.9474 49 29.9444V5.44444C49 2.44149 46.5585 0 43.5556 0H5.44444ZM43.5556 5.44444V29.9444H5.44444V5.44444H43.5556Z"
              fill="white"
            />
          </svg>
          Rooms
        </Link>

        <Link to={"/library"} className="navItem" sx={{ color: "white" }}>
          <svg
            width="25"
            height="25"
            viewBox="0 0 40 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M33.7917 1.125H5.20833C2.95317 1.125 1.125 2.95317 1.125 5.20833V33.7917C1.125 36.0468 2.95317 37.875 5.20833 37.875H33.7917C36.0468 37.875 37.875 36.0468 37.875 33.7917V5.20833C37.875 2.95317 36.0468 1.125 33.7917 1.125Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.29167 1.125V37.875M1.125 10.3125H9.29167M1.125 19.5H37.875M1.125 28.6875H9.29167M29.7083 1.125V37.875M29.7083 10.3125H37.875M29.7083 28.6875H37.875"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Library
        </Link>
      </nav>

      <main>
        <Box className="avatarWrapper">
          <img
            src={userData.avatarUrl}
            className="userAvatar"
            alt="User Avatar"
            draggable="false"
          />
        </Box>

        <input type="file" onChange={handleFileChange} />

        <Box className="profileDetailsContainer">
          <Box>
            <Typography>
              <strong>Username</strong>
            </Typography>
            <Typography>{userData.username}</Typography>
          </Box>

          <Box>
            <Typography>
              <strong>E-mail</strong>
            </Typography>
            <Typography>{userData.email}</Typography>
          </Box>

          <Box>
            <Typography>
              <strong>BIO</strong>
            </Typography>
            <Typography>{userData.biography}</Typography>
          </Box>
        </Box>

        <Box className="optionButtons">
          <IconButton
            aria-label="editProfile"
            size="large"
            onClick={handleOpenModal}
          >
            <img
              src={EditProfileIcon}
              alt="Edit Profile"
              style={{ width: "24px", height: "24px" }}
            />
          </IconButton>

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

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 5,
          }}
          className="modalWindow"
        >
          <Box className="navModal">
            <Typography variant="h6" component="h2">
              Edit profile information
            </Typography>

            <IconButton aria-label="close" onClick={handleCloseModal}>
              <img src={CloseWindowIcon} height={20} />
            </IconButton>
          </Box>

          <Box className="modalContent">
            <OutlinedInput className="modalUsernameInput" />
            <OutlinedInput className="modalEmailInput" />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}