import { auth, db } from "../firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

export const getUserData = async (userId) => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }
  throw new Error("Data not found, try again");
};

export const logout = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const subscribeToAuthChanges = (callback) => {
  return auth.onAuthStateChanged(callback);
};