import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/dbConnect'; // Adjust path as needed
import { RowDataPacket } from 'mysql2';

type PropertyDetails = RowDataPacket & {
  ListingId: string | number;
  PropertyType?: string;
  Media: string;           // original JSON string from DB
  AssociationAmenities: string; // original JSON string from DB
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parsedMedia?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parsedAssociationAmenities?: any[];  
  MRD_LASTREETNUMBER?: string;
  MRD_LASTREETNAME?: string;
  MRD_LACITY?: string;
  YearBuilt?: number;
  UnparsedAddress?: string;
  PublicRemarks?: string;
  MRD_MAIN_SQFT?: number;
  BedroomsTotal?: number;
  BathroomsFull?: number;
  ListPrice?: number;
  // Add any other fields you need
};

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
    if (property.Media) {
    try {
      property.parsedMedia = JSON.parse(property.Media);
    } catch {
      property.parsedMedia = [];
    }
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
