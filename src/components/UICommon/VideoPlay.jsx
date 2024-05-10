import React, { useEffect, useRef } from "react";

export default function VideoPlay({ videopath, poster }) {
  const videoRef = useRef();

  useEffect(() => {
    videoRef.current?.load();
  }, [videopath]);

  return (
    <video ref={videoRef} controls autoPlay playsInline muted loop preload={"auto"} poster={poster}>
      <source
        src={videopath}
        type="video/mp4"
      />
      Your browser does not support the video tag.
    </video>
  )
}