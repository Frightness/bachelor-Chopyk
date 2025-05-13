import AWS from "aws-sdk";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION,
});

const s3 = new AWS.S3();

export async function uploadAvatar(file) {
  const user = auth.currentUser;
  let oldAvatarURL;

  if (user) {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      oldAvatarURL = docSnap.data().avatarUrl;

      if (
        oldAvatarURL !==
        "https://cinemly-users-uploaded-videos.s3.eu-north-1.amazonaws.com/avatars/defaultAvatar.svg"
      ) {
        const fileName = oldAvatarURL.split("/").pop();
        await deleteAvatarFromS3(fileName);
      }
    } else {
      console.log("Error");
    }
  }

  const params = {
    Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
    Key: `avatars/${file.name}`,
    Body: file,
    ContentType: file.type,
  };

  try {
    const data = await s3.upload(params).promise();
    const uploadURL = data.Location;

    if (user) {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        avatarUrl: uploadURL,
      });
    }

    return uploadURL;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function deleteAvatarFromS3(fileName) {
  const params = {
    Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
    Key: `avatars/${fileName}`,
  };

  try {
    await s3.deleteObject(params).promise();
  } catch (error) {
    console.error(error);
  }
}