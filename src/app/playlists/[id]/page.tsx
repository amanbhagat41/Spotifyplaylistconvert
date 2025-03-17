"use client";

import { useEffect, useState } from "react";
import { SpotifyTrack } from "@/types/spotify";
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";
import YouTubeAudioPlayer from "@/component/YoutubeAudioPlayer";
interface Props {
    params: Promise<{ id: string }>;
}

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
});

export default function PlaylistDetails({ params }: Props) {
    const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loadingTrack, setLoadingTrack] = useState<boolean>(true);
    const [id, setId] = useState<string | null>(null);
    const [videoId, setVideoId] = useState<string | null>(null);
    // const [loading, setLoading] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(
        null
    );
    // ✅ Get Spotify Access Token
    const getAccessToken = async () => {
        try {
            const token = localStorage.getItem("spotify_access_token");
            if (token) {
                spotifyApi.setAccessToken(token);
                return;
            }

            const code = new URLSearchParams(window.location.search).get(
                "code"
            );
            if (!code) throw new Error("No authorization code found");

            const response = await fetch("/api/spotify/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code }),
            });

            if (!response.ok) throw new Error("Failed to retrieve token");

            const data = await response.json();
            localStorage.setItem("spotify_access_token", data.access_token);
            spotifyApi.setAccessToken(data.access_token);
        } catch (err) {
            console.log(err);
            setError("Failed to retrieve Spotify token");
        }
    };

    useEffect(() => {
        const unwrapParams = async () => {
            const resolvedParams = await params;
            setId(resolvedParams.id);
        };
        unwrapParams();
    }, [params]);

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                if (!id) return;

                await getAccessToken();

                const response = await spotifyApi.getPlaylistTracks(id);
                const data = response.body.items.map(
                    (item: SpotifyApi.PlaylistTrackObject) => item.track
                );
                setTracks(data);
            } catch (err) {
                console.log(err);
                setError("Failed to fetch tracks");
            } finally {
                setLoadingTrack(false);
            }
        };

        fetchTracks();
    }, [id]);

    // Search YouTube for Track
    // const playFromYouTube = async (track: SpotifyTrack) => {
    //     try {
    //         const query =
    //             `${track.name} ${track.artists
    //                 .map((artist) => artist.name)
    //                 .join(" ")}` + " lyrics";
    //         console.log(query);
    //         const res = await axios.get(
    //             `https://www.googleapis.com/youtube/v3/search`,
    //             {
    //                 params: {
    //                     part: "snippet",
    //                     q: query,
    //                     key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
    //                     maxResults: 1,
    //                     type: "video",
    //                 },
    //             }
    //         );

    //         if (res.data.items.length > 0) {
    //             setVideoId(res.data.items[0].id.videoId);
    //         } else {
    //             alert("No video found for this track.");
    //         }
    //     } catch (err) {
    //         setError("Failed to find video on YouTube");
    //     }
    // };

    // Search yt-dlp for Track
    const playFromYouTube = async (track: SpotifyTrack, index: number) => {
        try {
            const query =
                `${track.name} ${track.artists
                    .map((artist) => artist.name)
                    .join(" ")}` + " lyrics";
            console.log(query);
            console.log("audio Loading");
            setCurrentTrackIndex(index);
            // Call your backend to get the video ID from yt-dlp
            const res = await axios.get("/api/getVideoId", {
                params: {
                    query, // Pass the query (track name and artists) to your backend
                },
            });

            if (res.data && res.data.videoId) {
                setVideoId(res.data.videoId);
            } else {
                alert("No video found for this track.");
            }
        } catch (err) {
            console.log(err);
            setError("Failed to find video on YouTube");
        }
        console.log("Current Track Index: ", currentTrackIndex);
        console.log("Video ID: ", videoId);
    };
    const handleNextTrack = async () => {
        if (
            currentTrackIndex !== null &&
            currentTrackIndex < tracks.length - 1
        ) {
            const nextIndex = currentTrackIndex + 1;
            setCurrentTrackIndex(nextIndex);
            await playFromYouTube(tracks[nextIndex], nextIndex); // ✅ Load next track
        }
    };

    if (loadingTrack) return <div>Loading Tracks...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-4">
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Playlist Tracks</h1>
                {tracks.length === 0 && <p>No tracks found.</p>}
                <ul>
                    {tracks.map((track, index) => (
                        <li key={track.id} className="mb-4">
                            <div
                                className="flex items-center gap-4 cursor-pointer"
                                onClick={() => playFromYouTube(track, index)}
                            >
                                {track.album.images.length > 0 && (
                                    <img
                                        src={track.album.images[0].url}
                                        alt={track.name}
                                        className="w-16 h-16 object-cover rounded-md"
                                    />
                                )}
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        {track.name}
                                    </h2>
                                    <p className="text-gray-400">
                                        {track.artists
                                            .map((artist) => artist.name)
                                            .join(", ")}
                                    </p>
                                    <p className="text-gray-400">
                                        Album: {track.album.name}
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mb-30"></div>

            {/* ✅ Render YouTube Audio Player */}
            {videoId && tracks && currentTrackIndex !== null && (
                <YouTubeAudioPlayer
                    videoId={videoId}
                    tracks={tracks}
                    currentTrackIndex={currentTrackIndex}
                    onTrackEnd={handleNextTrack}
                />
            )}
        </div>
    );
}
