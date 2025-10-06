/* eslint-disable @typescript-eslint/no-unused-vars */
// /pages/api/properties.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import db from '../../lib/dbConnect';
import { RowDataPacket } from 'mysql2';
import { uploadMLSImagesBatch } from '@/utils/uploadMLS';

const CACHE_DURATION = 100440 * 60 * 1000; // 1440 minutes
const MLS_ENDPOINT = 'https://api.mlsgrid.com/v2/Property?$top=5000&$filter=PropertyType eq 7 and StandardStatus eq 1';
const token = process.env.API_BEARER_TOKEN;

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
  Media: string; // JSON array stored as string
  AssociationAmenities: string; // JSON string
  OriginalEntryTimestamp: Date;
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
      const cloudinaryUrls = await uploadMLSImagesBatch(mediaUrls, property.ListingKey);

      // Save uploaded URLs to DB
      await db.query('UPDATE properties SET Media = ? WHERE ListingKey = ? AND Media = ?', [
        JSON.stringify(cloudinaryUrls),
        property.ListingKey,
        '[]'
      ]);

      console.log(`Property ${property.ListingKey} uploaded & saved:`, cloudinaryUrls);
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const offset = (page - 1) * limit;

    const city = (req.query.city as string) || '';
    const bed = parseInt(req.query.bed as string) || 0;
    const bath = parseInt(req.query.bath as string) || 0;
    const priceMin = parseInt(req.query.priceMin as string) || 0;
    const priceMax = parseInt(req.query.priceMax as string) || 0;

    let query = 'SELECT * FROM properties WHERE 1=1';
    let query2 = 'SELECT COUNT(*) AS total FROM properties WHERE 1=1';
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
      query += ' AND UnparsedAddress LIKE ?';
      query2 += ' AND UnparsedAddress LIKE ?';
     
      const city_name = city.split(',')[0].trim()  // split city name only like, "Oak Brook"

      params.push(`%${city_name}%`);
      params2.push(`%${city_name}%`);
      params3.push(`%${city_name}%`);
    
    }
      query3 = query;
      query3 +=  ' AND Media = ?'
      params3.push('[]');


    query += ' LIMIT ? OFFSET ?';
    query3 += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    params3.push(limit, offset);

    // Check last update timestamp
    const [rows] = await db.query<LastUpdatedRow[]>('SELECT MAX(OriginalEntryTimestamp) AS lastUpdated FROM properties');
    const lastUpdated = rows[0]?.lastUpdated ? new Date(rows[0].lastUpdated).getTime() : 0;
    const now = Date.now();

    if (lastUpdated && now - lastUpdated < CACHE_DURATION) {
      // Serve cached properties
      const [properties] = await db.query<PropertyRow[]>(query, params);

      // Filter properties that have non-empty Media
      const noMediaProperties = properties.filter((p) => {
      if (!p.Media) return true; // no Media at all → keep

      try {
        const media = JSON.parse(p.Media);

        // if it's an array, keep only if empty
        if (Array.isArray(media)) {
          return media.length === 0;
        }

        // if it's an object with MediaURL → has media → exclude
        if (media?.MediaURL) {
          return false;
        }

        // fallback: exclude if truthy
        return !media;
      } catch {
        // not JSON → check if it's an empty string
        return !(typeof p.Media === "string" && p.Media.trim().length > 0);
      }
    });


      // Upload media to Cloudinary & save URLs
      console.log(noMediaProperties.length)
      await syncPropertiesWithMedia(noMediaProperties);

      // Fetch all newly inserted properties after Media inserted
      let [parsedProperties] = await db.query<PropertyRow[]>(query3, params3);

      parsedProperties = properties.map(p => ({
        ...p,
        Media: p.Media ? JSON.parse(p.Media) : []
      }));

      const [countRows] = await db.query<TotalRow[]>(query2, params2);

      return res.status(200).json({
        data: parsedProperties,
        total: countRows[0]?.total ?? 0,
        page,
        limit
      });
    }

    // Fetch fresh data from MLS
    const { data } = await axios.get(MLS_ENDPOINT, {
      headers: { Authorization: `Bearer ${process.env.API_BEARER_TOKEN}` }
    });

    if (!Array.isArray(data.value)) throw new Error('Invalid MLS data');

    // Clear old cached data
    await db.query('DELETE FROM properties');

    // Bulk insert
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values = data.value.map((p: any) => [
      p.ListingKey,
      `${p.MRD_LASTREETNUMBER || ''} ${p.MRD_LASTREETNAME || ''}, ${p.MRD_LACITY || ''}`,
      p.ListPrice || 0,
      p.BedroomsTotal || 0,
      p.BathroomsTotalInteger || 0,
      p.LivingArea || 0,
      p.PublicRemarks || '',
      p.YearBuilt || '',
      p.City || '',
      p.MRD_SASTATE || '',
      JSON.stringify([]), // Media initially empty
      JSON.stringify(p.AssociationAmenities || []),
      p.ListAgentFullName || '',
      p.ListAgentEmail || '',
      p.ListAgentOfficePhone || '',
      p.ListOfficeURL || '',
      p.ListingContractDate || '',
      new Date()
    ]);

    if (values.length) {
      await db.query(
        `INSERT INTO properties 
        (ListingKey, UnparsedAddress, ListPrice, BedroomsTotal, BathroomsTotalInteger, LivingArea, PublicRemarks, YearBuilt, City, MRD_SASTATE, Media, AssociationAmenities, ListAgentFullName, ListAgentEmail, ListAgentOfficePhone, ListOfficeURL, ListingContractDate, OriginalEntryTimestamp) 
        VALUES ?`,
        [values]
      );
    }

    // Fetch all newly inserted properties
    const [properties] = await db.query<PropertyRow[]>(query, params);

    // Upload media to Cloudinary & save URLs
    await syncPropertiesWithMedia(properties);

    // Fetch all newly inserted properties after MEdia inserted
    const [parsedProperties] = await db.query<PropertyRow[]>(query, params);

    const [countRows] = await db.query<TotalRow[]>('SELECT COUNT(*) AS total FROM properties');

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