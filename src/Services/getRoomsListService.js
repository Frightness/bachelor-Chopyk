import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const firestore = getFirestore();

export const getRoomsList = async () => {
  try {
      const roomsRef = collection(firestore, "rooms");
      const q = query(roomsRef, where("roomType", "==", "Public"));
  
      const querySnapshot = await getDocs(q);
  
      const roomsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      if (roomsData) {
        return {success: true, roomsData}
      } else {
        return {success: false, message: "No rooms data found!"}
      }
    } catch (error) {
      return {success: false, message: error.message}
    }
};