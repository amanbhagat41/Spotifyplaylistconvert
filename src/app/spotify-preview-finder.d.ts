// src/types/spotify-preview-finder.d.ts
declare module "spotify-preview-finder" {
    interface SpotifyPreviewResult {
        success: boolean;
        error?: string;
        results: {
            name: string;
            artist: string;
            previewUrls: string[];
        }[];
    }

    function spotifyPreviewFinder(
        query: string,
        limit?: number
    ): Promise<SpotifyPreviewResult>;

    export = spotifyPreviewFinder;
}
