// import React from "react";

interface VideoPopupProps {
  youtubeKey: string;
  onClose: () => void;
}

const VideoPopup = ({ youtubeKey, onClose }: VideoPopupProps) => {
  return (
    <div className="videoWrap">
      <button onClick={onClose}>닫기</button>
      <div>
        <iframe src={`https://www.youtube.com/embed/${youtubeKey}`}></iframe>
      </div>
    </div>
  );
};

export default VideoPopup;
