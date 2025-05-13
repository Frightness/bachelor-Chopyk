import "./RoomsPage.css";
import { Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CreateRoomModal from "../../components/CreateRoomModal/CreateRoomModal";
import { createRoom } from "../../services/createRoomService";
import { subscribeToPublicRooms } from "../../services/roomService";
import NavBar from "../../components/NavBar/NavBar";

export default function RoomsPage() {
  const [roomsList, setRoomsList] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribeToPublicRooms(setRoomsList);
    return () => unsubscribe();
  }, []);

  const handleCreateRoom = async (roomData) => {
    if (!roomData) {
      return;
    }
    
    const createRoomResponse = await createRoom(roomData);

    if (createRoomResponse.success) {
      navigate(`/room/${createRoomResponse.docRef.id}`);
    } else {
      console.log(createRoomResponse.message);
    }
  };

  return (
    <div className="roomsPageWrapper">
      <NavBar />

      <main>
        <Button
          className="createRoomButton"
          variant="contained"
          onClick={() => setOpen(true)}
        >
          Create a room
        </Button>
      </main>

      <div className="publicRoomsText">
        <Typography>Public rooms</Typography>
        <Typography>You can join any of them</Typography>
      </div>

      <div className="roomsList">
        {roomsList.map((room) => (
          <div className="roomInfo" key={room.room_id}>
            <img
              className="roomImage"
              src="https://static.vecteezy.com/system/resources/thumbnails/020/510/220/small_2x/gaming-workstation-neon-lights-room-video.jpg"
              alt="icon"
            />
            <Link className="roomName" to={`/room/${room.room_id}`}>
              {room.roomName}
            </Link>
            <Typography className="participantsInfo">
              Participants: {room.currentParticipants}/{room.numParticipants}
            </Typography>
          </div>
        ))}
      </div>

      <CreateRoomModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={handleCreateRoom}
      />
    </div>
  );
}