import "./ProfilePage.css";
import { Typography, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { auth, db } from '../../firebase';
import { doc, getDoc } from "firebase/firestore";

import TestAvatar from "../../Assets/avatar.jpg";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          setMessage('User data not found.');
        }
        setLoading(false);
      } else {
        setMessage('No user is logged in.');
        setLoading(false);
      }
    });
    
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (message) {
    return <div>{message}</div>;
  }

  return (
    <Box className="profilePageWrapper">
      <nav>
        <Typography>Profile</Typography>
        <Typography>Rooms</Typography>
        <Typography>Library</Typography>
      </nav>

      <main>
        <img src={TestAvatar} height={"200px"} className="userAvatar" />

        <Box className="profileDetailsContainer">
          <Box>
            <Typography><strong>Username</strong></Typography>
            <Typography>{userData.username}</Typography>
          </Box>

          <Box>
            <Typography><strong>E-mail</strong></Typography>
            <Typography>{userData.email}</Typography>
          </Box>

          <Box>
            <Typography><strong>BIO</strong></Typography>
            <Typography>Example BIO</Typography>
          </Box>
        </Box>
      </main>
    </Box>
  );
}
