import React, { useEffect, useRef } from "react";

type VideoPlayProps = {
  videopath: string;
  poster?: string;
};

export default function VideoPlay({ videopath, poster }: VideoPlayProps): React.ReactNode {
  const videoRef = useRef();

  useEffect(() => {
    if (videoRef && videoRef.current) videoRef?.current?.load();
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