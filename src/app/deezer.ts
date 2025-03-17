// import type { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     if (req.method !== "GET") {
//         return res.status(405).json({ error: "Method not allowed" });
//     }

//     // ✅ Fix: Handle `string | string[]` type issue
//     const query = Array.isArray(req.query.query)
//         ? req.query.query[0]
//         : req.query.query;

//     if (!query) {
//         return res.status(400).json({ error: "Query is required" });
//     }

//     try {
//         const deezerUrl = `https://api.deezer.com/search?q=${encodeURIComponent(
//             query
//         )}`;

//         // ✅ Fix CORS issue: Use a server-side request to avoid CORS problems
//         const response = await fetch(deezerUrl);
//         if (!response.ok) {
//             throw new Error(
//                 `Failed to fetch from Deezer: ${response.statusText}`
//             );
//         }

//         const data = await response.json();

//         if (data.data && data.data.length > 0) {
//             const previewUrl = data.data[0].preview; // Get the preview URL from Deezer
//             res.status(200).json({ success: true, previewUrl });
//         } else {
//             res.status(404).json({
//                 success: false,
//                 error: "No preview available",
//             });
//         }
//     } catch (err) {
//         console.error("Error fetching Deezer track:", err);
//         res.status(500).json({ success: false, error: (err as Error).message });
//     }
// }
