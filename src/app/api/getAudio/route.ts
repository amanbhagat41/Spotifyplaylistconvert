import { NextRequest } from "next/server";
import { exec } from "child_process";

export async function GET(req: NextRequest) {
    const videoUrl = req.nextUrl.searchParams.get("videoUrl");

    if (!videoUrl) {
        return new Response(
            JSON.stringify({ error: "Missing videoUrl parameter" }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    return new Promise<Response>((resolve) => {
        const command = `yt-dlp -f bestaudio --get-url "${videoUrl}"`;

        exec(command, (error, stdout) => {
            if (error) {
                console.error(`Error fetching audio URL: ${error}`);
                resolve(
                    new Response(
                        JSON.stringify({
                            error: "Failed to extract audio URL",
                        }),
                        {
                            status: 500,
                            headers: { "Content-Type": "application/json" },
                        }
                    )
                );
            } else {
                const audioUrl = stdout.trim();
                resolve(
                    new Response(JSON.stringify({ audioUrl }), {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    })
                );
            }
        });
    });
}
