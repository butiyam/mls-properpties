import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { imageUrl } = req.query;
  const { ListingKey } = req.query;

  if (!imageUrl || typeof imageUrl !== 'string') {
    res.status(400).json({ error: 'Image URL required' });
    return;
  }

   const folderPath = path.resolve(`./public/${ListingKey}`);

    if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    }

  try {
    // Fetch image as arraybuffer
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);

    // Define save path (e.g., public/images folder)
    const fileName = path.basename(imageUrl);
    const savePath = path.resolve(`./public/${ListingKey}`, fileName);

    // Save file locally
    fs.writeFileSync(savePath, buffer);

    res.status(200).json({ message: 'Image downloaded', path: `/images/${fileName}` });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download image' });
  }
}
