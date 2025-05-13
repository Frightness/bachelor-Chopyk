import { auth } from "../firebase";
import {
  updatePassword,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

export const changeUserPassword = async (oldPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, oldPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    return { success: true, message: "Password was changed successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const changeUserEmail = async (newEmail, currentPassword) => {
  try {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    await reauthenticateWithCredential(user, credential);
    await updateEmail(user, newEmail);
    return { success: true, message: "Email was changed successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};