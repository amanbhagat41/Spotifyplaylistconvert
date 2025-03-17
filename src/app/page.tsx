"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LoginButton from "@/component/LoginButton";

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if the access token exists in localStorage
        const token = localStorage.getItem("spotify_access_token");

        // Set the state based on whether the token exists or not
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        // Clear access token from localStorage
        localStorage.removeItem("spotify_access_token");

        // Redirect to Spotify login page to log out of Spotify
        window.open("https://accounts.spotify.com/logout", "_blank");
        window.location.reload();
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Spotify Playlist Viewer</h1>
            {/* Only show LoginButton if not logged in */}
            {!isLoggedIn && <LoginButton />}

            {/* Only show View Playlists link if logged in */}
            {isLoggedIn && (
                <Link
                    href="/playlists"
                    className="block mt-4 text-blue-500 hover:underline"
                >
                    View Playlists
                </Link>
            )}

            {/* Only show Log Out button if logged in */}
            {isLoggedIn && (
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white p-2 rounded mt-4"
                >
                    Log Out
                </button>
            )}

            {/* Show a message if the user is logged out */}
            {!isLoggedIn && (
                <p className="mt-4 text-gray-500">
                    Please log in to view your playlists.
                </p>
            )}
        </div>
    );
}
