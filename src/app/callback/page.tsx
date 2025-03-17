"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getAccessToken = async () => {
            const code = new URLSearchParams(window.location.search).get(
                "code"
            );
            if (!code) {
                setError("No code found in the URL");
                return;
            }

            try {
                const response = await fetch("/api/spotify/token", {
                    method: "POST",
                    body: JSON.stringify({ code }),
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) throw new Error("Failed to fetch token");

                const data = (await response.json()) as {
                    access_token: string;
                };

                localStorage.setItem("spotify_access_token", data.access_token);
                router.push("/"); // Redirect to homepage
            } catch (err) {
                setError("Failed to authorize with Spotify");
            }
        };

        getAccessToken();
    }, [router]);

    if (error) return <div>{error}</div>;

    return <div>Logging you in...</div>;
}
