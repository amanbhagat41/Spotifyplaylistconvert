"use client";

import { getSpotifyAuthUrl } from "@/app/spotifyAuth";

export default function LoginButton() {
    const handleLogin = () => {
        window.location.href = getSpotifyAuthUrl();
    };

    return (
        <button
            onClick={handleLogin}
            className="bg-green-500 text-white p-2 rounded"
        >
            Login with Spotify
        </button>
    );
}
