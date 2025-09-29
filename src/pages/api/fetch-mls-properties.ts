/* eslint-disable @typescript-eslint/no-unused-vars */
// /pages/api/properties.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import db from '../../lib/dbConnect';
import { RowDataPacket } from 'mysql2';
import { uploadMLSImagesBatch } from '@/utils/uploadMLS';

const MLS_ENDPOINT = 'https://api.mlsgrid.com/v2/Property?$top=5000&$filter=PropertyType eq 7 and StandardStatus eq 1';
const token = process.env.API_BEARER_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {

    // Fetch fresh data from MLS API
    const { data } = await axios.get(MLS_ENDPOINT, { headers: { Authorization: `Bearer ${process.env.API_BEARER_TOKEN}` } });

    if (!Array.isArray(data.value)) throw new Error('Invalid MLS data');

    // Bulk insert
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values = data.value.map((p: any) => [
      p.ListingKey,
      p.StreetNumber,
      p.StreetName,
      p.StreetSuffix,
      p.PostalCode,
      p.City,
      p.StateOrProvince,
      p.ListPrice || 0,
      p.BedroomsTotal || 0,
      p.BathroomsTotalInteger || 0,
      p.LivingArea || 0,
      p.PublicRemarks || '',
      p.YearBuilt || '',
      JSON.stringify(p.AssociationAmenities || []),
      p.ListAgentFullName || '',
      p.ListAgentEmail || '',
      p.ListAgentOfficePhone || '',
      p.ListOfficeURL || '',
      p.ListingContractDate || '',
      new Date()
    ]);

    if (values.length) {
     console.log(values.length)
    // Upsert each property to update selected fields excluding Media

      const rowCount = values.length;
      const placeholders = '(' + new Array(20).fill('?').join(', ') + ')';
      const allPlaceholders = new Array(rowCount).fill(placeholders).join(', ');

      // Flatten all values arrays into one single array of params
      const flatValues = values.flat();

    await db.query(
      `INSERT INTO properties 
        (ListingKey,
         StreetNumber,
         StreetName,
         StreetSuffix,
         PostalCode,
         City,
         StateOrProvince,
         ListPrice,
         BedroomsTotal, 
         BathroomsTotalInteger, 
         LivingArea, 
         PublicRemarks,
         YearBuilt,  
         AssociationAmenities, 
         ListAgentFullName, 
         ListAgentEmail, 
         ListAgentOfficePhone, 
         ListOfficeURL, 
         ListingContractDate,
         updatedAt)
      VALUES ${allPlaceholders}
      ON DUPLICATE KEY UPDATE
        ListingKey = VALUES(ListingKey),
        StreetNumber = VALUES(StreetNumber),
        StreetName = VALUES(StreetName),
        StreetSuffix = VALUES(StreetSuffix),
        PostalCode = VALUES(PostalCode),
        City = VALUES(City),
        StateOrProvince = VALUES(StateOrProvince),
        ListPrice = VALUES(ListPrice),
        BedroomsTotal = VALUES(BedroomsTotal),
        BathroomsTotalInteger = VALUES(BathroomsTotalInteger),
        LivingArea = VALUES(LivingArea),
        PublicRemarks = VALUES(PublicRemarks),
        YearBuilt = VALUES(YearBuilt),  
        AssociationAmenities = VALUES(AssociationAmenities), 
        ListAgentFullName = VALUES(ListAgentFullName), 
        ListAgentEmail = VALUES(ListAgentEmail), 
        ListAgentOfficePhone = VALUES(ListAgentOfficePhone), 
        ListOfficeURL = VALUES(ListOfficeURL), 
        ListingContractDate = VALUES(ListingContractDate), 
        updatedAt = VALUES(updatedAt)
      `,
      flatValues
    );

    }

  return res.status(200).json({ status: 'success', msg: 'Updated done!' });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('API /properties error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
