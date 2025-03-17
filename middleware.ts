import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(req: NextRequest) {
    const url = req.nextUrl.pathname.replace("/downloads/", "");
    const filePath = path.join("/tmp", url);

    if (fs.existsSync(filePath)) {
        const file = fs.readFileSync(filePath);
        const response = new NextResponse(file, {
            headers: {
                "Content-Type": "audio/mpeg",
                "Content-Disposition": `attachment; filename="${url}"`,
            },
        });

        // ✅ Optionally clean up after download
        // fs.unlinkSync(filePath);

        return response;
    } else {
        return new Response("File not found", { status: 404 });
    }
}
