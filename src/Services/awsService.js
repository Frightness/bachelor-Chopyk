import AWS from 'aws-sdk';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION
});

const s3 = new AWS.S3();
const db = getFirestore();
const auth = getAuth();

export async function uploadAvatar(file) {
  const params = {
    Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
    Key: `avatars/${file.name}`, 
    Body: file,
    ContentType: file.type
  };

  try {
    const data = await s3.upload(params).promise();
    const uploadURL = data.Location;

    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        avatarUrl: uploadURL
      });
      console.log('Avatar URL updated in Firebase');
    } else {
      console.log('No user is logged in');
    }

    return uploadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}