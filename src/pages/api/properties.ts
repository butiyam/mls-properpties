/* eslint-disable @typescript-eslint/no-unused-vars */
// /pages/api/properties.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import db from '../../lib/dbConnect';
import { RowDataPacket } from 'mysql2';
import { uploadMLSImagesBatch } from '@/utils/uploadMLS';

//const MLS_ENDPOINT = 'https://api.mlsgrid.com/v2/Property?$top=5000&$filter=PropertyType eq 7 and StandardStatus eq 1';
const token = process.env.API_BEARER_TOKEN;

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
  PhotosCount: number;
  StandardStatus: string;
  Media: string; // JSON array stored as string
  AssociationAmenities: string; // JSON string
  OriginalEntryTimestamp: Date;
};

const sortMapping: Record<string, string> = {
  newest: 'OriginalEntryTimestamp DESC',
  priceHigh: 'ListPrice DESC',
  priceLow: 'ListPrice ASC',
};

async function fetchMLSMedia(property: PropertyRow) {

  try {
    const res = await axios.get(`https://api.mlsgrid.com/v2/Property('${property.ListingKey}')?$expand=Media`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Always return array of URLs
    const mediaArray: string[] = Array.isArray(res.data.Media)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? res.data.Media.map((m: any) => m.MediaURL)
      : [];

    return mediaArray;
  } catch (error) {
    //console.error(`Failed to fetch media fors ${property[0]}:`, error);
    return [];
  }
}

async function syncPropertiesWithMedia(properties: PropertyRow[]) {
  for (const property of properties) {
   console.log(property.ListingKey)
   const mediaUrls = await fetchMLSMedia(property);

    if (mediaUrls.length > 0) {
      // Upload all MLS media to Cloudinary
      const cloudinaryUrls = await uploadMLSImagesBatch(mediaUrls[0], property.ListingKey);

      // Save uploaded URLs to DB
      await db.query('UPDATE properties SET Media = ? WHERE ListingKey = ? AND Media = ?', [
        JSON.stringify(cloudinaryUrls),
        property.ListingKey,
        '[]'
      ]);
      await new Promise(res => setTimeout(res, 50)); // 50ms pause

      //console.log(`Property ${property.ListingKey} uploaded & saved:`, cloudinaryUrls);
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {

    const sortBy = (req.query.sortBy as string) || '';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    //const streetname = (req.query.streetname as string) || '';
    //const streetnumber = (req.query.streetnumber as string) || '';
    //const postalcode = (req.query.postalcode as string) || '';
    const city = (req.query.city as string) || '';
    const state = (req.query.state as string) || '';
    const bed = parseInt(req.query.bed as string) || 0;
    const bath = parseInt(req.query.bath as string) || 0;
    const priceMin = parseInt(req.query.priceMin as string) || 0;
    const priceMax = parseInt(req.query.priceMax as string) || 0;

    let query = 'SELECT * FROM properties WHERE 1=1 AND ListPrice > 0';
    let query2 = 'SELECT COUNT(*) AS total FROM properties WHERE 1=1 AND ListPrice > 0';
    let query3 = '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params2: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params3: any[] = [];

    if (bed) {
      query += ' AND BedroomsTotal = ?';
      query2 += ' AND BedroomsTotal = ?';
      params.push(bed);
      params2.push(bed);
      params3.push(bed);
    }
    if (bath) {
      query += ' AND BathroomsTotalInteger = ?';
      query2 += ' AND BathroomsTotalInteger = ?';
      params.push(bath);
      params2.push(bath);
      params3.push(bath);
    }
    if (priceMin && priceMax) {
      query += ' AND ListPrice BETWEEN ? AND ?';
      query2 += ' AND ListPrice BETWEEN ? AND ?';
      params.push(priceMin, priceMax);
      params2.push(priceMin, priceMax);
      params3.push(priceMin, priceMax);
    }
    if (city) {
      query += ' AND City LIKE ?';
      query2 += ' AND City LIKE ?';

      params.push(`%${city}%`);
      params2.push(`%${city}%`);
      params3.push(`%${city}%`);
    
    }
    if (state) {
      query += ' AND StateOrProvince LIKE ?';
      query2 += ' AND StateOrProvince LIKE ?';
    
      params.push(`%${state}%`);
      params2.push(`%${state}%`);
      params3.push(`%${state}%`);
    
    }


      query3 = query;
      query3 +=  ' AND Media = ?'
      params3.push('[]');

    // Build order by clause if valid sortBy provided
    const orderByClause = sortMapping[sortBy] ? ` ORDER BY ${sortMapping[sortBy]}` : '';

    // Append order by clause before pagination
    query += orderByClause;
    query3 += orderByClause;

    query += ' LIMIT ? OFFSET ?';
    query3 += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    params3.push(limit, offset);

    // Serve cached properties
    const [properties] = await db.query<PropertyRow[]>(query, params);

    const  parsedProperties = properties.map(p => ({
        ...p,
        Media: p.Media ? JSON.parse(p.Media) : [],
        StreetNumber: p.StreetNumber ? p.StreetNumber : '',
        StreetName: p.StreetName ? p.StreetName : '',
        StreetSuffix: p.StreetSuffix ? p.StreetSuffix : '', 
      }));

      const [countRows] = await db.query<TotalRow[]>(query2, params2);

      return res.status(200).json({
        data: parsedProperties,
        total: countRows[0]?.total ?? 0,
        page,
        limit
      });
    

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('API /properties error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}