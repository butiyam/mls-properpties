/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/dbConnect'; // Adjust path as needed
import { RowDataPacket } from 'mysql2';
import axios from 'axios';
import { uploadMLSImagesBatch } from '@/utils/uploadMLS';
const token = process.env.API_BEARER_TOKEN;
type PropertyDetails = RowDataPacket & {
  ListingId: string;
  PropertyType?: string;
  Media?: string; // original JSON string from DB
  AssociationAmenities: string; // original JSON string from DB
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

type PropertyMeida = RowDataPacket & {
Media?: string[];
  // Add any other fields you need
};

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
  updatedAt: Date;
};

async function fetchMLSMedia(property: PropertyDetails) {

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
    console.error(`Failed to fetch media fors ${property[0]}:`, error);
    return [];
  }
}

async function syncPropertiesWithMedia(property: PropertyDetails, skip: boolean
) {
 
    let mediaUrls = await fetchMLSMedia(property);
    
    // Keep only first 10
    if (mediaUrls.length > 10) {
       mediaUrls = mediaUrls.slice(0, 10);
    }

    if (mediaUrls.length > 0) {
      console.log(mediaUrls.length)
      // Upload all MLS media to Cloudinary
      const cloudinaryUrls = await uploadMLSImagesBatch(mediaUrls.length > 1 && skip ? mediaUrls.slice(1) : mediaUrls , property.ListingKey);

      if(skip){
        let Media: string[];
        try {
          
         const [rows] = await db.query<PropertyMeida[]>('SELECT Media FROM properties WHERE ListingKey = ? LIMIT 1', [property.ListingKey] );
         const p = rows[0];

           if (Array.isArray(p.Media)) {
            Media = p.Media; 
          } else if (typeof p.Media === "string") {
            try {
              Media = JSON.parse(p.Media || "[]");
            } catch {
              Media = [];
            }
          } else {
            Media = [];
          }

        if(mediaUrls.length > 1){
          console.log('first image url will be skipped')       
          if (skip) {
            console.log('at last added 1 url');
            
            cloudinaryUrls.unshift( Media[0] );
          }
        }
        if(mediaUrls.length === 1){
          console.log(Media[0])
            cloudinaryUrls.unshift(Media[0]);
        }
        
        } catch (error) {
         console.log(error) 
        }
    }

      // Save uploaded URLs to DB
      await db.query('UPDATE properties SET Media = ? WHERE ListingKey = ? AND Media = ?', [
        JSON.stringify(cloudinaryUrls),
        property.ListingKey,
        '[]'
      ]);

      return cloudinaryUrls;
    }
  
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing property ID' });

  try {
    const [rows] = await db.query<PropertyDetails[]>(
      'SELECT * FROM final_properties WHERE ListingKey = ?  AND ListPrice > 0 LIMIT 1',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const property = rows[0];

    // Parse Media if stored as JSON string
    if (property.Media) {
    try {
      property.Media = JSON.parse(property.Media);
    } catch {
      property.Media = '[]';
    }
   }

   if (property.AssociationAmenities) {
    try {
      property.parsedAssociationAmenities = JSON.parse(property.AssociationAmenities);
    } catch {
      property.parsedAssociationAmenities = [];
    }
   }

      if(!property.StreetNumber){
        property.StreetNumber = '';
      }
      if(!property.StreetName){
        property.StreetName = '';
      }
      
      if(!property.StreetSuffix){
        property.StreetSuffix = '';
      }

    return res.status(200).json(property);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Property Details API error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
