import AWS from "aws-sdk";

const s3 = new AWS.S3();

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION,
});

export const uploadVideo = async (file) => {
  const params = {
    Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
    Key: `user-videos/${file.name}`,
    Body: file,
    ContentType: file.type,
  };
  const upload = await s3.upload(params).promise();
  
  if (upload) {
    return {success: true, message: "Video successfully uploaded!", video_path: upload.Location};
  } else {
    return {success: false, message: "Error! Try again"};
  }
}