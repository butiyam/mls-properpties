import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/dbConnect'; // Adjust path as needed
import { RowDataPacket } from 'mysql2';
import axios from 'axios';

type PropertyDetails = RowDataPacket & {
  ListingId: string;
  PropertyType?: string;
  Media: string;           // original JSON string from DB
  AssociationAmenities: string; // original JSON string from DB
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parsedMedia?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parsedAssociationAmenities?: any[];  
  StreetNumber?: string;
  StreetName?: string;
  City?: string;
  StateOrProvince?: string;
  YearBuilt?: number;
  UnparsedAddress?: string;
  PublicRemarks?: string;
  MRD_MAIN_SQFT?: number;
  BedroomsTotal?: number;
  BathroomsFull?: number;
  ListPrice?: number;
  // Add any other fields you need
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchMediaForProperties(ListingId: string): Promise<any[]> {
  const token = process.env.API_BEARER_TOKEN;
  try {
    const mediaRes = await axios.get(
      `https://api.mlsgrid.com/v2/Property('${ListingId}')?$expand=Media`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // MLS API usually puts related media under 'Media' property
    return mediaRes.data.Media ?? [];
  } catch (error) {
    console.error(`Failed to fetch media for ${ListingId}:`, error);
    return [];
  }
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing property ID' });

  try {
    const [rows] = await db.query<PropertyDetails[]>(
      'SELECT * FROM properties WHERE ListingKey = ? LIMIT 1',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const property = rows[0];
    // Parse Media if stored as JSON string
    try {
      property.parsedMedia = JSON.parse(property.Media)//await fetchMediaForProperties(property.ListingKey);
    } catch (error: unknown){
      property.parsedMedia = [error];
    }

   if (property.AssociationAmenities) {
    try {
      property.parsedAssociationAmenities = JSON.parse(property.AssociationAmenities);
    } catch {
      property.parsedAssociationAmenities = [];
    }
   }

    return res.status(200).json(property);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Property Details API error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
