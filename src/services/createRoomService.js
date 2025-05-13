import {
  getFirestore,
  collection,
  setDoc,
  serverTimestamp,
  doc,
} from "firebase/firestore";

const firestore = getFirestore();

export const createRoom = async (roomData) => {
  try {
    const docRef = doc(collection(firestore, "rooms"));

    const cleanRoomData = Object.fromEntries(
      Object.entries(roomData).filter(([_, value]) => value !== undefined)
    );

    await setDoc(docRef, {
      ...cleanRoomData,
      room_id: docRef.id,
      createdAt: serverTimestamp(),
    });

    if (docRef) {
      return { success: true, docRef };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};