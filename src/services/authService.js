import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export const loginService = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: true, message: "Login successful!" };
    } else {
      return { success: false, message: "User not found!" };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const registerService = async (email, password, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: email,
      created_at: serverTimestamp(),
      biography:
        "It's the default biography for all users. In the future you will have the opportunity to change it :)",
      avatarUrl:
        "https://cinemly-users-uploaded-videos.s3.eu-north-1.amazonaws.com/avatars/defaultAvatar.svg",
    });

    return { success: true, message: "Registration successful!" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
