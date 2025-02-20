import React, { useState } from "react";
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
import { uploadVideo } from "../../Services/uploadVideoService";

export default function CreateRoomModal({ open, onClose, onCreate }) {
  const [roomType, setRoomType] = useState("Public");
  const [streamSource, setStreamSource] = useState("Choose stream source");
  const [roomPassword, setRoomPassword] = useState("");
  const [currentParticipants, setCurrentParticipants] = useState(0);
  const [file, setFile] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [numParticipants, setNumParticipants] = useState("");
  const [youtubeVideoURL, setYouTubeVideoURL] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCreate = async () => {
    let videoUrl = "";
    if (streamSource === "My own video" && file) {
      videoUrl = await uploadVideo(file);
      if (!videoUrl.success) return;
      videoUrl = videoUrl.video_path;
    } else {
      videoUrl = youtubeVideoURL;
    }

    onCreate({
      roomName,
      numParticipants,
      roomType,
      streamSource,
      videoUrl,
      roomPassword,
      currentParticipants
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="modalContent">
        <div className="modalHeader">
          <Typography
            variant="h6"
            className="modalTitle"
            sx={{ color: "white" }}
          >
            Room details
          </Typography>
        </div>

        <TextField
          fullWidth
          placeholder="Room name"
          margin="normal"
          className="modalInputField"
          onChange={(e) => setRoomName(e.target.value)}
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
        />
        <TextField
          fullWidth
          placeholder="Maximum participants"
          margin="normal"
          type="number"
          className="modalInputField"
          onChange={(e) => setNumParticipants(e.target.value)}
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
        />
        <Select
          fullWidth
          value={streamSource}
          onChange={(e) => setStreamSource(e.target.value)}
          sx={{ color: "white" }}
        >
          <MenuItem value="Choose stream source" disabled>
            Choose video source
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
              <Typography variant="body2" sx={{ color: "white", marginTop: 1 }}>
                Selected file: {file.name}
              </Typography>
            )}
          </Box>
        )}
        {streamSource === "YouTube" && (
          <TextField
            fullWidth
            placeholder="YouTube video URL"
            margin="normal"
            type="text"
            className="modalInputField"
            onChange={(e) => setYouTubeVideoURL(e.target.value)}
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
          />
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
            onChange={(e) => setRoomPassword(e.target.value)}
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
          />
        )}
        <Button
          fullWidth
          variant="contained"
          className="createButton"
          sx={{ mt: 2 }}
          onClick={handleCreate}
        >
          Create
        </Button>
      </Box>
    </Modal>
  );
}
