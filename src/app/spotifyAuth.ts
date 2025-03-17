const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";

export const getSpotifyAuthUrl = (): string => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID as string;
    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI as string;
    const scope = process.env.NEXT_PUBLIC_SPOTIFY_SCOPE as string;

    const params = new URLSearchParams({
        client_id: clientId,
        response_type: "code",
        redirect_uri: redirectUri,
        scope,
    });

    return `${SPOTIFY_AUTH_URL}?${params.toString()}`;
};
