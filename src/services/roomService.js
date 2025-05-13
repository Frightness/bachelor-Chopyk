import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export const subscribeToPublicRooms = (callback) => {
  const roomsRef = collection(db, "rooms");
  const q = query(roomsRef, where("roomType", "==", "Public"));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const rooms = [];

    querySnapshot.forEach((doc) => {
      const roomData = doc.data();
      const currentParticipantsCount = roomData.participants?.length || 0;
      const maxParticipants = parseInt(roomData.numParticipants) || 0;

      if (currentParticipantsCount < maxParticipants) {
        rooms.push({
          ...roomData,
          room_id: doc.id,
          currentParticipants: currentParticipantsCount,
        });
      }
    });

    rooms.sort((a, b) => {
      const freeSpacesA = a.numParticipants - a.currentParticipants;
      const freeSpacesB = b.numParticipants - b.currentParticipants;
      return freeSpacesB - freeSpacesA;
    });

    callback(rooms);
  });

  return unsubscribe;
};