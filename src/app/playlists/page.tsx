"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpotifyPlaylist } from "@/types/spotify";

export default function PlaylistsPage() {
    const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlaylists = async () => {
            const token = localStorage.getItem("spotify_access_token");
            if (!token) {
                setError("No access token found");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    "https://api.spotify.com/v1/me/playlists",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Log status code and response headers
                console.log("Response Status:", response.status);
                console.log("Response Headers:", response.headers);

                // Read response as text to inspect possible HTML error page
                const textResponse = await response.text();
                console.log("Response Text:", textResponse);

                if (!response.ok) {
                    setError(`Failed to fetch playlists: ${textResponse}`);
                    throw new Error(
                        `Failed to fetch playlists: ${textResponse}`
                    );
                }

                // Parse JSON response
                const data = JSON.parse(textResponse);
                setPlaylists(data.items);
            } catch (err) {
                console.log(err);
                setError("Error fetching playlists:");
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylists();
    }, []);

    if (loading) return <div>Loading your playlists...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Your Playlists</h1>
            <ul className="grid grid-cols-4 gap-4">
                {playlists.map((playlist) => (
                    <li key={playlist.id}>
                        <Link href={`/playlists/${playlist.id}`}>
                            <div className="p-4 bg-gray-800 rounded-md cursor-pointer hover:bg-gray-700 transition">
                                {playlist.images.length > 0 && (
                                    <img
                                        src={playlist.images[0].url}
                                        alt={playlist.name}
                                        className="w-full h-full object-cover rounded-md mb-2"
                                    />
                                )}
                                <h2 className="text-xl font-semibold">
                                    {playlist.name}
                                </h2>
                                <p className="text-gray-400">
                                    by {playlist.owner.display_name}
                                </p>
                                <p className="text-gray-400">
                                    {playlist.tracks.total} tracks
                                </p>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
