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
    await setDoc(docRef, {
      ...roomData,
      room_id: docRef.id,
      createdAt: serverTimestamp(),
    });

    if (docRef) {
      return { success: true, docRef };
    }
  } catch (error) {
    return { success: false, message: "Something went wrong, try again!" };
  }
};