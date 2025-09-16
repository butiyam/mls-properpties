// /pages/api/properties.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import db from '../../lib/dbConnect';
import { RowDataPacket } from 'mysql2';


const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
const MLS_ENDPOINT = 'https://api.mlsgrid.com/v2/Property?$expand=Media';

type LastUpdatedRow = RowDataPacket & { lastUpdated: string | null };
type PropertyRow = RowDataPacket & {
  id: number;
  ListingKey: string;
  UnparsedAddress: string;
  ListPrice: number;
  BedroomsTotal: number;
  BathroomsTotalInteger: number;
  LivingArea: number;
  Media: string; // JSON string
  updatedAt: Date;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check last update time from DB cache
    const [rows] = await db.query<LastUpdatedRow[]>('SELECT MAX(updatedAt) AS lastUpdated FROM properties');
        
    const lastUpdatedStr = rows[0]?.lastUpdated;
    const lastUpdated = lastUpdatedStr ? new Date(lastUpdatedStr).getTime() : 0;
    const now = Date.now();

    if (lastUpdated && now - lastUpdated < CACHE_DURATION) {
      // Serve cached properties
      const [properties] = await db.query<PropertyRow[]>('SELECT * FROM properties');
      // Parse Media JSON strings before sending
      const parsedProperties = properties.map(p => ({
        ...p,
        Media: JSON.parse(p.Media),
      }));
      return res.status(200).json(parsedProperties);
    }

    // Fetch from MLS Grid API
    const { data } = await axios.get(MLS_ENDPOINT, {
      headers: { Authorization: `Bearer ${process.env.API_BEARER_TOKEN}` }
    });

    // Clear old cached data
    await db.query('DELETE FROM properties');

    // Prepare data for bulk insert
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values = data.value.map((p: any) => [
      p.ListingKey,
      p.UnparsedAddress,
      p.ListPrice,
      p.BedroomsTotal,
      p.BathroomsTotalInteger,
      p.LivingArea,
      JSON.stringify(p.Media || []),
      new Date()
    ]);

    if (values.length) {
      await db.query(
        `INSERT INTO properties (ListingKey, UnparsedAddress, ListPrice, BedroomsTotal, BathroomsTotalInteger, LivingArea, Media, updatedAt) VALUES ?`,
        [values]
      );
    }

    return res.status(200).json(data.value);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('API /properties error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
