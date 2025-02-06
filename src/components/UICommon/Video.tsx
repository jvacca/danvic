import React, { useState, useEffect, useRef } from "react";
import Config from "../../config";
import styles from "./Video.module.scss";
import IconPause from "../../assets/svg/icon-pause-wh.svg";
import IconPlay from "../../assets/svg/icon-play-wh.svg";

type VideoProps = {
    videoName: string;
    controls?: boolean;
    poster?: string;
};

export default function Video({ videoName, controls, poster }: VideoProps): React.ReactNode {
    const [isPlaying, setIsPlaying] = useState<boolean>(true);
    const [userInteracted, setUserInteracted] = useState<boolean>(false);
    const videoRef = useRef(null);

    const togglePlayPause = () => {
        console.log('toggleplaypause');
        setUserInteracted(true);

        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };


    useEffect(() => {
        // updateViewport(); // Initial check
        // window.addEventListener("resize", updateViewport);

        const handlePlayVideo = (entries: any) => {
            const [entry] = entries;
            if (userInteracted) return;

            if (videoRef.current) {
                if (entry.intersectionRatio > 0.3) {
                    videoRef.current.play();
                    setIsPlaying(true);
                } else {
                    videoRef.current.pause();
                    setIsPlaying(false);
                }
            }
        };



        const videoOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.3 // trigger at 30%
        };

        const videoObserver = new IntersectionObserver(handlePlayVideo, videoOptions);

        if (videoRef.current) {
            videoObserver.observe(videoRef.current);
        }

        return () => {
            videoObserver.disconnect();
        }

    }, [userInteracted]);

    return (
        <>
            <video
                key={`${videoName}-${poster}`}
                poster={poster ? Config.CAMPAIGNROOT + "images/" + poster : undefined}
                ref={videoRef}
                loop={true}
                playsInline
                muted
                preload={"auto"}
                >
                <source
                    src={Config.CAMPAIGNROOT + "videos/" + videoName}
                    type="video/mp4"
                />
                Your browser does not support the video tag.
            </video>
            {controls && <button className={styles.videoControls} onClick={togglePlayPause}>
                {isPlaying ? <IconPause/> : <IconPlay/>}
            </button>}
        </>
    );
}
