import "./RoomsPage.css";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getFirestore, collection, addDoc, updateDoc } from "firebase/firestore";
import ProfileIcon from "../../Assets/ProfileIcon.svg";
import RoomsIcon from "../../Assets/RoomsIcon.svg";
import LibraryIcon from "../../Assets/LibraryIcon.svg";
import CreateRoomModal from "../../Components/CreateRoomModal/CreateRoomModal";

const firestore = getFirestore();

export default function RoomsPage() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateRoom = async (roomData) => {
    try {
      const docRef = await addDoc(collection(firestore, "rooms"), {
        ...roomData,
        createdAt: new Date(),
      });
      await updateDoc(docRef, { room_id: docRef.id });

      navigate(`/room/${docRef.id}`);
    } catch (error) {
      console.error("Error creating room:", error);
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

      <CreateRoomModal open={open} onClose={() => setOpen(false)} onCreate={handleCreateRoom} />
    </div>
  );
}