import { NextRequest } from "next/server";
import { exec } from "child_process";

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get("query");

    if (!query) {
        return new Response(
            JSON.stringify({ error: "Missing query parameter" }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    return new Promise<Response>((resolve) => {
        // Use yt-dlp to search for the video and extract the video ID
        const command = `yt-dlp "ytsearch:${query}" --get-id`;

        exec(command, (error, stdout) => {
            if (error) {
                console.error(`Error fetching video ID: ${error}`);
                resolve(
                    new Response(
                        JSON.stringify({
                            error: "Failed to extract video ID",
                        }),
                        {
                            status: 500,
                            headers: { "Content-Type": "application/json" },
                        }
                    )
                );
            } else {
                const videoId = stdout.trim();
                resolve(
                    new Response(
                        JSON.stringify({ videoId }), // Return the video ID
                        {
                            status: 200,
                            headers: { "Content-Type": "application/json" },
                        }
                    )
                );
            }
        });
    });
}
