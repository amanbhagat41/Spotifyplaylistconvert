export interface SpotifyImage {
    url: string;
    height: number;
    width: number;
}

// Assuming this is your SpotifyTrack type definition
export interface SpotifyTrack {
    id: string;
    name: string;
    uri: string; // Add the uri property here
    preview_url?: string;
    album: {
        name: string;
        images: { url: string }[];
    };
    artists: {
        name: string;
    }[];
    audioPreview: string | null;
}

export interface SpotifyPlaylist {
    id: string;
    name: string;
    owner: {
        display_name: string;
    };
    tracks: {
        total: number;
    };
    images: SpotifyImage[];
}
interface SongPreview {
    previewUrls: string[];
    name: string;
}

interface SpotifyPreviewResponse {
    success: boolean;
    results: SongPreview[];
    error?: string; // Optional error message
}
