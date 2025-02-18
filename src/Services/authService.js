import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import axios from "axios";
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

    const ipResponse = await axios.get("https://api.ipify.org?format=json");
    const ipAddress = ipResponse.data.ip;

    const localDate = new Date();
    const localDateString = localDate.toLocaleString();

    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: email,
      created_at: localDateString,
      location: ipAddress,
      biography:
        "It's default biography for all users, in future you will have opportunity to change it :)",
      favoriteList: "",
      friendsList: "",
      avatarUrl:
        "https://cinemly-users-uploaded-videos.s3.eu-north-1.amazonaws.com/avatars/defaultAvatar.svg",
      watchLaterList: "",
    });

    return { success: true, message: "Registration successful!" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};