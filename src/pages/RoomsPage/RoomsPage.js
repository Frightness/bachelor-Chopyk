import "./RoomsPage.css";
import { Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProfileIcon from "../../assets/ProfileIcon.svg";
import RoomsIcon from "../../assets/RoomsIcon.svg";
import LibraryIcon from "../../assets/LibraryIcon.svg";
import CreateRoomModal from "../../components/CreateRoomModal/CreateRoomModal";
import { getRoomsList } from "../../services/getRoomsListService";
import { createRoom } from "../../services/createRoomService";
import { db } from "../../firebase";
import { onSnapshot, collection, query, where } from "firebase/firestore";

export default function RoomsPage() {
  const [roomsList, setRoomsList] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const roomsRef = collection(db, "rooms");
    const q = query(roomsRef, where("roomType", "==", "Public"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const rooms = [];
      const now = Date.now();
      
      querySnapshot.forEach((doc) => {
        const roomData = doc.data();
        const participants = roomData.participants || {};
        
        const activeParticipants = Object.values(participants).filter(
          p => p && p.lastActivity && (now - p.lastActivity) < 60000
        );

        rooms.push({
          ...roomData,
          room_id: doc.id,
          currentParticipants: activeParticipants.length
        });
      });
      
      setRoomsList(rooms);
    });

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
      <nav>
        <Link to={"/profile"} className="navItem">
          <img src={ProfileIcon} alt="Profile" />
          Profile
        </Link>

        <Link to={"/rooms"} className="navItem roomsNavItem">
          <img src={RoomsIcon} height={25} alt="Rooms" />
          Rooms
        </Link>

        <Link to={"/library"} className="navItem">
          <img src={LibraryIcon} height={25} alt="Library" />
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