// ✅ Use client component
"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import playButton from "/public/images/play-button-svgrepo-com.svg";
import pauseButton from "/public/images/pause-button-svgrepo-com.svg";
import downloadButton from "/public/images/download_button.png";
import nextSong from "/public/images/next-track-button.png";
import { SpotifyTrack } from "@/types/spotify";
interface YouTubeAudioPlayerProps {
    videoId: string;
    tracks: SpotifyTrack[];
    currentTrackIndex: number;
    onTrackEnd: () => void; // ✅ New prop
}

const YouTubeAudioPlayer: React.FC<YouTubeAudioPlayerProps> = ({
    videoId,
    tracks,
    currentTrackIndex,
    onTrackEnd,
}) => {
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const fetchAudioUrl = async () => {
            try {
                const audio = audioRef.current;
                if (audio) audio.pause();
                const response = await axios.get(
                    `/api/getAudio?videoUrl=https://www.youtube.com/watch?v=${videoId}`
                );
                setAudioUrl(response.data.audioUrl);
            } catch (err) {
                console.error("Failed to fetch audio URL", err);
            }
        };

        fetchAudioUrl();

        console.log(tracks);
        console.log(currentTrackIndex);
    }, [videoId]);

    const handleLoadedMetadata = () => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = volume;
            console.log("audio Loaded");
            audio.muted = true; // ✅ Start muted to bypass autoplay restrictions
            audio
                .play()
                .then(() => {
                    audio.muted = false; // ✅ Unmute after autoplay starts
                    setIsPlaying(true);
                })
                .catch((err) => {
                    console.warn("Autoplay blocked:", err);
                    setIsPlaying(false); // ✅ Let the user manually play
                });
        }
    };

    const togglePlayback = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch((err) => {
                    console.warn("Failed to play:", err);
                });
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(event.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(event.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };
    const handleEndofSong = () => {
        if (audioRef.current) {
            if (audioRef.current.currentTime === duration) {
                audioRef.current.currentTime = 0;
                setIsPlaying(false);
                onTrackEnd();
            }
        }
    };
    const handleNextSong = () => {
        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = 0;
            audio.pause();
            setIsPlaying(false);
            onTrackEnd();
        }
    };

    const fetchDownloadAudio = async () => {
        try {
            const response = await axios.get(
                `/api/getDownloadSingle?videoUrl=https://www.youtube.com/watch?v=${videoId}`
            );

            if (response.data.audioUrl) {
                console.log("Downloaded Audio URL:", response.data.audioUrl);

                // ✅ Create a link and trigger download
                const link = document.createElement("a");
                link.href = response.data.audioUrl;
                link.setAttribute("download", "track.mp3"); // Suggested file name
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.error("No audio URL returned");
            }
        } catch (err) {
            console.error("Failed to download audio:", err);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex justify-between items-center shadow-xl  z-10">
            {/* Left Section (Album Cover, Song Name, Artists) */}
            {audioUrl && (
                <audio
                    ref={audioRef}
                    src={audioUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata} // ✅ Autoplay trigger
                    onEnded={handleEndofSong}
                />
            )}
            <div className="flex items-center gap-4">
                <img
                    src={tracks[currentTrackIndex]?.album?.images[0]?.url}
                    alt={tracks[currentTrackIndex]?.name}
                    className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex flex-col">
                    <h2 className="text-xl font-semibold">
                        {tracks[currentTrackIndex]?.name}
                    </h2>
                    <p className="text-sm text-gray-400">
                        {tracks[currentTrackIndex]?.artists
                            .map((artist: { name: string }) => artist.name)
                            .join(", ")}
                    </p>
                </div>
                <Image
                    src={downloadButton}
                    alt="Download"
                    width={25}
                    height={25}
                    onClick={fetchDownloadAudio}
                    className="cursor-pointer"
                />
            </div>

            {/* Center Section (Progress Bar) */}
            <div className="mx-auto w-1/2">
                <div className="flex items-center gap-4 mb-2 justify-center">
                    <Image
                        src={isPlaying ? pauseButton : playButton}
                        width={40}
                        height={40}
                        alt={isPlaying ? "Pause Button" : "Play Button"}
                        onClick={togglePlayback}
                        className="cursor-pointer"
                    />
                    <Image
                        src={nextSong}
                        width={40}
                        height={40}
                        alt={"Next Song"}
                        onClick={handleNextSong}
                        className="cursor-pointer"
                    />
                </div>
                <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full"
                />
                {/* Time Display */}
                <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>
                        {new Date(currentTime * 1000)
                            .toISOString()
                            .substr(14, 5)}
                    </span>
                    <span>
                        {duration
                            ? new Date(duration * 1000)
                                  .toISOString()
                                  .substr(14, 5)
                            : "00:00"}
                    </span>
                </div>
            </div>

            <div className="flex flex-col items-center mt-10">
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-24"
                />
                <div className="text-sm text-gray-400 mt-2">
                    Volume: {Math.round(volume * 100)}%
                </div>
            </div>
        </div>
    );
};

export default YouTubeAudioPlayer;
