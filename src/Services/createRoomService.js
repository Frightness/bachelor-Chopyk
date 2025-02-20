import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
} from "firebase/firestore";

const firestore = getFirestore();

export const createRoom = async (roomData) => {
  try {
    const docRef = await addDoc(collection(firestore, "rooms"), {
      ...roomData,
      createdAt: new Date(),
    });
    await updateDoc(docRef, { room_id: docRef.id });

    if (docRef) {
      return {success: true, docRef}
    }
  } catch (error) {
    return {success: false, message: "Something went wrong, try again!"}
  }
};