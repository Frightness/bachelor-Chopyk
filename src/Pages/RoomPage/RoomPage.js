import { useParams } from "react-router-dom";
import "./RoomPage.css";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function RoomPage() {
  const { roomID } = useParams();
  const [roomInfo, setRoomInfo] = useState("");

  useEffect(() => {
    const getRoomInfo = async () => {
      const docRef = doc(db, "rooms", roomID);
      const docSnap = await getDoc(docRef);
      
      console.log(roomInfo)
      if (docSnap.exists()) {
        setRoomInfo(docSnap.data());
      } else {
        console.log("Room data not found!");
      }
    }

    getRoomInfo();
  }, []);

  return (
    <div className="roomWrapper">
      <video controls className="video" src={roomInfo.videoUrl}></video>

      <div className="roomInfo">
        <p>Room name: {roomInfo.roomName}</p>
        <p>Max participants: {roomInfo.numParticipants}</p>
        <p>Room type: {roomInfo.roomType}</p>
      </div>
    </div>
  );
}