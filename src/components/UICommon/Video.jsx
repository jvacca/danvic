import React, { useState, useEffect, useRef } from "react";
import Config from "../../config";
import styles from "./Video.module.scss";
import IconPause from "../../assets/svg/icon-pause-wh.svg";
import IconPlay from "../../assets/svg/icon-play-wh.svg";

export default function Video({ videoName, controls, poster }) {
    const [isPlaying, setIsPlaying] = useState(true);
    const [userInteracted, setUserInteracted] = useState(false);
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

        const handlePlayVideo = (entries) => {
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

    }, []);

    return (
        <>
            <video
                key={`${videoName}-${poster}`}
                poster={poster ? Config.CAMPAIGNROOT + "images/" + poster : undefined}
                ref={videoRef}
                loop="loop"
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
