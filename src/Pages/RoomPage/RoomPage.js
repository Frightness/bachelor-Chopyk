import { useParams } from "react-router-dom";
import "./RoomPage.css";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { IconButton, TextField, Typography } from "@mui/material";
import SettingsIcon from "../../Assets/SettingsIcon.svg";
import LogOutIcon from "../../Assets/LogOutIcon.svg";
import Divider from "@mui/material/Divider";

export default function RoomPage() {
  const { roomID } = useParams();
  const [roomInfo, setRoomInfo] = useState("");

  useEffect(() => {
    const getRoomInfo = async () => {
      const docRef = doc(db, "rooms", roomID);
      const docSnap = await getDoc(docRef);

      console.log(roomInfo);
      if (docSnap.exists()) {
        setRoomInfo(docSnap.data());
      } else {
        console.log("Room data not found!");
      }
    };

    getRoomInfo();
  }, []);

  return (
    <div className="roomWrapper">
      <video controls className="video" src={roomInfo.videoUrl}></video>

      <div className="sideBar">
        <div className="sideBarHeader">
          <IconButton
            aria-label="room setting"
            size="large"
            className="iconButton"
          >
            <img
              src={SettingsIcon}
              alt="Settings room"
              style={{ width: "24px", height: "24px" }}
            />
          </IconButton>

          <Typography sx={{ fontWeight: "bold" }}>
            {roomInfo.roomName}
          </Typography>

          <IconButton aria-label="logout" size="large" className="iconButton">
            <img
              src={LogOutIcon}
              alt="Logout"
              style={{ width: "24px", height: "24px" }}
            />
          </IconButton>
        </div>
        <Divider sx={{ backgroundColor: "white" }} />
        <div className="roomChat">
          <TextField
            className="chatMessageField"
            placeholder="Write a message..."
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "none",
                },
                "&.Mui-focused fieldset": {
                  border: "none",
                },
              },
              "& .MuiInputBase-root": {
                outline: "none",
              },
            }}
          ></TextField>
        </div>
      </div>
    </div>
  );
}