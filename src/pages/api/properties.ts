// /pages/api/properties.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import db from '../../lib/dbConnect';
import { RowDataPacket } from 'mysql2';


const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
const MLS_ENDPOINT = 'https://api.mlsgrid.com/v2/Property?$expand=Media,Rooms,UnitTypes&$filter=PropertyType eq 7 and StandardStatus eq 1';
//https://api.mlsgrid.com/v2/Property?$expand=Media,Rooms,UnitTypes&$filter=PropertyType eq 7 and StandardStatus eq 1

type LastUpdatedRow = RowDataPacket & { lastUpdated: string | null };
type TotalRow = RowDataPacket & { total: number | null };
type PropertyRow = RowDataPacket & {
  id: number;
  ListingKey: string;
  UnparsedAddress: string;
  ListPrice: number;
  BedroomsTotal: number;
  BathroomsTotalInteger: number;
  LivingArea: number;
  PublicRemarks: string;
  Media: string; // JSON string
  AssociationAmenities: string; // JSON string
  updatedAt: Date;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {

  let query = 'SELECT * FROM properties WHERE 1=1';
  const params = [];

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  const city = (req.query.city as string) || 0;
  const bed = parseInt(req.query.bed as string) || 0;
  const bath = parseInt(req.query.bath as string) || 0;
  const priceMin = (req.query.priceMin as string) || 0;
  const priceMax = (req.query.priceMax as string) || 0;

  
  if (bed) {
    query += ' AND BedroomsTotal = ?';
    params.push(bed);
  }
  if (bath) {
    query += ' AND BathroomsTotalInteger = ?';
    params.push(bath);
  }
  if (priceMin && priceMax) {
    query += ' AND ListPrice BETWEEN ? AND ?';
    params.push(priceMin, priceMax);
  }
  
  if (city) {
    query += ' AND City = ?';
    params.push(city);
  }

  query += ' LIMIT ? OFFSET ?';
  params.push(limit, offset);

    //  return res.status(500).json({ error: query  +priceMax });
    // Check last update time from DB cache
    const [rows] = await db.query<LastUpdatedRow[]>('SELECT MAX(updatedAt) AS lastUpdated FROM properties');
        
    const lastUpdatedStr = rows[0]?.lastUpdated;
    const lastUpdated = lastUpdatedStr ? new Date(lastUpdatedStr).getTime() : 0;
    const now = Date.now();

    if (lastUpdated && now - lastUpdated < CACHE_DURATION) {
      // Serve cached properties
      const [properties] = await db.query<PropertyRow[]>(query,params);
      // Parse Media JSON strings before sending
      const parsedProperties = properties.map(p => ({
        ...p,
        Media: JSON.parse(p.Media),
      }));

       // Optionally, fetch total count for pagination controls
      const [countRows] = await db.query<TotalRow[]>(
        'SELECT COUNT(*) as total FROM properties'
      );

      return res.status(200).json({ 
        data: parsedProperties,
        total: countRows[0]?.total ?? 0,
        page,
        limit
      });
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
      p.MRD_LASTREETNUMBER+' '+p.MRD_LASTREETNAME+', '+p.MRD_LACITY,
      p.ListPrice,
      p.BedroomsTotal,
      p.BathroomsTotalInteger,
      p.LivingArea,
      p.PublicRemarks,
      p.YearBuilt,
      p.City,
      p.MRD_SASTATE,
      JSON.stringify(p.Media || []),
      JSON.stringify(p.AssociationAmenities || []),
      p.ListAgentFullName,
      p.ListAgentEmail,
      p.ListAgentOfficePhone,
      p.ListOfficeURL,
      p.ListingContractDate,
      new Date()
    ]);

    if (values.length) {
      await db.query(
        `INSERT INTO properties (ListingKey, UnparsedAddress, ListPrice, BedroomsTotal, BathroomsTotalInteger, LivingArea, PublicRemarks, YearBuilt, City, MRD_SASTATE ,Media, AssociationAmenities, ListAgentFullName, ListAgentEmail, ListAgentOfficePhone, ListOfficeURL, ListingContractDate, updatedAt) VALUES ?`,
        [values]
      );
    }

    // Serve cached properties
      const [properties] = await db.query<PropertyRow[]>(query,params);
      // Parse Media JSON strings before sending
      const parsedProperties = properties.map(p => ({
        ...p,
        Media: JSON.parse(p.Media),
      }));

       // Optionally, fetch total count for pagination controls
      const [countRows] = await db.query<TotalRow[]>(
        'SELECT COUNT(*) as total FROM properties'
      );

      return res.status(200).json({ 
        data: parsedProperties,
        total: countRows[0]?.total ?? 0,
        page,
        limit
      });


    //return res.status(200).json(data.value);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('API /properties error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
