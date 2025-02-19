import "./RoomsPage.css";
import {
  Button,
  Typography,
  Box,
  Modal,
  TextField,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getFirestore, collection, addDoc, updateDoc } from "firebase/firestore";
import { uploadVideo } from "../../Services/uploadVideoService"

const firestore = getFirestore();

export default function RoomsPage() {
  const [open, setOpen] = useState(false);
  const [roomType, setRoomType] = useState("Public");
  const [streamSource, setStreamSource] = useState("");
  const [file, setFile] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [numParticipants, setNumParticipants] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadVideoToS3 = async (file) => {
    const path = await uploadVideo(file);
    if (path.success) {
      console.log(path.video_path);
      return path.video_path
    } else {
      console.log("")
      return
    }
  };

  const handleCreateRoom = async () => {
    try {
      let videoUrl = "";
      if (streamSource === "My own video" && file) {
        videoUrl = await uploadVideoToS3(file);
      }

      const roomData = {
        name: roomName,
        participants: numParticipants,
        type: roomType,
        streamSource,
        videoUrl,
        createdAt: new Date(),
      };
      const docRef = await addDoc(collection(firestore, "rooms"), roomData);
      await updateDoc(docRef, {room_id: docRef.id,});
      
      setOpen(false);
      console.log("Room successfully created!");

      navigate(`/room/${docRef.id}`);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  return (
    <div className="roomsPageWrapper">
      <nav>
        <Link to="/profile" className="navItem">
          Profile
        </Link>
        <Link to="/rooms" className="navItem roomsNavItem">
          Rooms
        </Link>
        <Link to="/library" className="navItem">
          Library
        </Link>
      </nav>

      <main>
        <Button
          className="createRoomButton"
          variant="contained"
          onClick={() => setOpen(true)}
        >
          Create a room
        </Button>
      </main>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className="modalContent">
          <Typography
            variant="h6"
            className="modalTitle"
            sx={{ color: "white" }}
          >
            Room details
          </Typography>
          <Button className="closeButton" onClick={() => setOpen(false)}>
            ✖
          </Button>
          <TextField
            fullWidth
            placeholder="Name"
            margin="normal"
            onChange={(e) => setRoomName(e.target.value)}
          />
          <TextField
            fullWidth
            placeholder="Number of participants"
            margin="normal"
            type="number"
            onChange={(e) => setNumParticipants(e.target.value)}
          />
          <Select
            fullWidth
            value={streamSource}
            onChange={(e) => setStreamSource(e.target.value)}
          >
            <MenuItem value="" disabled>
              Choose stream source...
            </MenuItem>
            <MenuItem value="YouTube">YouTube</MenuItem>
            <MenuItem value="My own video">My own video</MenuItem>
          </Select>
          {streamSource === "My own video" && (
            <Box marginTop={2}>
              <Typography
                variant="subtitle1"
                sx={{ color: "white", marginBottom: 1 }}
              >
                Upload your video
              </Typography>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                style={{ width: "100%", padding: "10px 0" }}
              />
              {file && (
                <Typography
                  variant="body2"
                  sx={{ color: "white", marginTop: 1 }}
                >
                  Selected file: {file.name}
                </Typography>
              )}
            </Box>
          )}
          <Typography
            variant="subtitle1"
            className="roomTypeTitle"
            sx={{ color: "white" }}
          >
            Room type
          </Typography>
          <RadioGroup
            row
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
          >
            <FormControlLabel
              value="Public"
              control={<Radio sx={{ color: "white" }} />}
              label="Public"
              sx={{ color: "white" }}
            />
            <FormControlLabel
              value="Private"
              control={<Radio sx={{ color: "white" }} />}
              label="Private"
              sx={{ color: "white" }}
            />
          </RadioGroup>

          {roomType === "Private" && (
            <TextField
              fullWidth
              placeholder="Room password"
              margin="normal"
              type="text"
              className="modalInputField"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    border: 'none',
                  },
                  '&.Mui-focused fieldset': {
                    border: 'none',
                  },
                },
                '& .MuiInputBase-root': {
                  outline: 'none',
                }
              }}
            />
          )}

          <Button
            fullWidth
            variant="contained"
            className="createButton"
            sx={{ mt: 2 }}
            onClick={handleCreateRoom}
          >
            Create
          </Button>
        </Box>
      </Modal>
    </div>
  );
}