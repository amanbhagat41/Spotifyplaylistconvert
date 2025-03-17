import { NextRequest } from "next/server";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

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

    const outputFile = path.join("/tmp", `downloaded_audio.mp3`);

    return new Promise((resolve) => {
        const command = `yt-dlp -x --audio-format mp3 -o "~/Downloads/%(title)s.%(ext)s" "${videoUrl}"`;

        console.log(`Running command: ${command}`);
        console.log(`Downloading to: ~/Downloads/${videoUrl}`);

        exec(command, (error) => {
            if (error) {
                console.error(`Error downloading audio: ${error}`);
                resolve(
                    new Response(
                        JSON.stringify({ error: "Failed to download audio" }),
                        {
                            status: 500,
                            headers: { "Content-Type": "application/json" },
                        }
                    )
                );
                return;
            }

            // ✅ Create a public URL for the file
            const publicUrl = `/downloads/downloaded_audio.mp3`;

            // ✅ Ensure the file is readable
            fs.chmodSync(outputFile, 0o644);

            resolve(
                new Response(JSON.stringify({ audioUrl: publicUrl }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                })
            );
        });
    });
}
