import cloudinary from "@/lib/cloudinary";
import axios from "axios";

export async function uploadMLSImagesBatch(
  mediaUrls: string | string[],
  listingId: string
): Promise<string[]> {
  const urls = Array.isArray(mediaUrls) ? mediaUrls : [mediaUrls];
  const uploadedUrls: string[] = [];

  for (const [index, mediaUrl] of urls.entries()) {
    try {
      const response = await axios.get(mediaUrl, { responseType: "arraybuffer" });
      const buffer = Buffer.from(response.data, "binary");

      const url: string = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "mls",
            public_id: `${listingId}-${index}-${Date.now()}`,
            resource_type: "image",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result?.secure_url || "");
          }
        );

        uploadStream.end(buffer);
      });

      uploadedUrls.push(url);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 429) {
        console.error(`Rate limit (429) hit for listing ${listingId}. Stopping upload.`);
        break; // 🚨 stop the loop and return what we have so far
      }
      console.error(`Failed to upload image ${index} for listing ${listingId}`, err);
    }
  }

  return uploadedUrls;
}
