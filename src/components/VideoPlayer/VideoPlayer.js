import React from 'react';
import './VideoPlayer.css';

const VideoPlayer = ({ src }) => {
  return (
    <video 
      className="videoPlayer"
      controls
      playsInline
      autoPlay
      src={src}
    >
      Your browser does not support the video tag
    </video>
  );
};

export default VideoPlayer; 