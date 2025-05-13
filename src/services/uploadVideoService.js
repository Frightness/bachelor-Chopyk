import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";

const CLOUDFRONT_DOMAIN = process.env.REACT_APP_CLOUDFRONT_DOMAIN;

const clientConfig = {
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  },
};

export const uploadVideo = async (file) => {
  console.log("2");
  const fileKey = `videos/${Date.now()}`;
  const params = {
    Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
    Key: fileKey,
    Body: file,
  };

  try {
    console.log("3");
    const parallelUploads3 = new Upload({
      client: new S3Client(clientConfig),
      partSize: 1024 * 1024 * 5,
      params: params,
      leavePartsOnError: false,
    });

    console.log("4");
    parallelUploads3.on("httpUploadProgress", (progress) => {
      console.log(progress);
    });

    await parallelUploads3.done();
    console.log("5");

    const videoURL = `https://${CLOUDFRONT_DOMAIN}/${fileKey}`;
    console.log("6");
    return {
      success: true,
      message: "Successfully uploaded video",
      videoUrl: videoURL,
    };
  } catch (error) {
    console.log(error.message);
    return {
      success: false,
      message: error.message,
    };
  }
};