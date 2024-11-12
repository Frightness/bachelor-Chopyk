import React, { useState } from 'react';
import { uploadAvatar } from '../Services/awsService.js';

function TestUploadComponent() {
  const [file, setFile] = useState(null);
  const [uploadURL, setUploadURL] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    try {
      const url = await uploadAvatar(file);
      setUploadURL(url);
      alert("File uploaded successfully!");
    } catch (error) {
      alert("File upload failed, see console for details.");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Test S3 File Upload</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload to S3</button>
      {uploadURL && (
        <div>
          <p>File uploaded successfully! Access it at:</p>
          <a href={uploadURL} target="_blank" rel="noopener noreferrer">
            {uploadURL}
          </a>
        </div>
      )}
    </div>
  );
}

export default TestUploadComponent;
