import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { code } = (await req.json()) as { code: string };

        if (!code) {
            return NextResponse.json(
                { error: "No code provided" },
                { status: 400 }
            );
        }

        const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID as string;
        const clientSecret = process.env
            .NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET as string;
        const redirectUri = process.env
            .NEXT_PUBLIC_SPOTIFY_REDIRECT_URI as string;

        const authOptions = new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_secret: clientSecret,
        });

        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: authOptions,
        });

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json({ error }, { status: response.status });
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Failed to process request" },
            { status: 500 }
        );
    }
}
