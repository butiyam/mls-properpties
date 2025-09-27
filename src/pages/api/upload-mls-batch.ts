import type { NextApiRequest, NextApiResponse } from "next";
import { uploadMLSImagesBatch } from "@/utils/uploadMLS";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { mediaUrls, listingId } = req.body;
    if (!mediaUrls || !Array.isArray(mediaUrls) || !listingId) {
      return res.status(400).json({ error: "Missing or invalid params" });
    }

    const urls = await uploadMLSImagesBatch(mediaUrls, listingId);
    return res.status(200).json({ urls });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "Batch upload failed" });
  }
}
