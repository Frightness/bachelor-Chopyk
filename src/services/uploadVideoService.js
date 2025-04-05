import AWS from "aws-sdk";

const s3 = new AWS.S3({
  maxRetries: 3,
  httpOptions: {
    timeout: 300000,
    connectTimeout: 5000
  }
});

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION,
});

const CHUNK_SIZE = 5 * 1024 * 1024;
const MAX_FILE_SIZE = 500 * 1024 * 1024;

export const uploadVideo = async (file, onProgress) => {
  try {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size exceeds 500MB limit");
    }

    if (!file.type.startsWith('video/')) {
      throw new Error("Invalid file type. Please upload a video file");
    }

    const fileName = `user-videos/${Date.now()}-${file.name}`;

    if (file.size <= CHUNK_SIZE) {
      const params = {
        Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
        Key: fileName,
        Body: file,
        ContentType: file.type,
      };

      const upload = s3.upload(params);
      
      upload.on('httpUploadProgress', (progress) => {
        const percentage = Math.round((progress.loaded / progress.total) * 100);
        if (onProgress) onProgress(percentage);
      });

      const result = await upload.promise();
      const cloudFrontURL = `https://${process.env.REACT_APP_CLOUDFRONT_URL}/${result.Key}`;
      
      return {
        success: true,
        message: "Video successfully uploaded!",
        video_path: cloudFrontURL,
      };
    }

    const multipartParams = {
      Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
      Key: fileName,
      ContentType: file.type
    };

    const multipartUpload = await s3.createMultipartUpload(multipartParams).promise();
    const uploadId = multipartUpload.UploadId;

    const numParts = Math.ceil(file.size / CHUNK_SIZE);
    const uploadPromises = [];
    const parts = [];

    for (let i = 0; i < numParts; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      const uploadPartParams = {
        Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
        Key: fileName,
        PartNumber: i + 1,
        UploadId: uploadId,
        Body: chunk
      };

      const uploadPromise = s3.uploadPart(uploadPartParams).promise()
        .then(result => {
          parts[i] = {
            ETag: result.ETag,
            PartNumber: i + 1
          };
          
          const uploadedSize = (i + 1) * CHUNK_SIZE;
          const percentage = Math.min(Math.round((uploadedSize / file.size) * 100), 100);
          if (onProgress) onProgress(percentage);
        });

      uploadPromises.push(uploadPromise);
    }

    await Promise.all(uploadPromises);

    const completeParams = {
      Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
      Key: fileName,
      MultipartUpload: {
        Parts: parts.sort((a, b) => a.PartNumber - b.PartNumber)
      },
      UploadId: uploadId
    };

    await s3.completeMultipartUpload(completeParams).promise();
    
    const cloudFrontURL = `https://${process.env.REACT_APP_CLOUDFRONT_URL}/${fileName}`;
    
    return {
      success: true,
      message: "Video successfully uploaded!",
      video_path: cloudFrontURL,
    };

  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, message: error.message };
  }
};