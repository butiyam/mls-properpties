import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { query } = req;

    const API_URL = `https://api.mlsgrid.com/v2/Property('${query.id}')?$expand=Media`;
    const BEARER_TOKEN = process.env.API_BEARER_TOKEN || '';

    try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BEARER_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching properties:', error.message);
    res.status(500).json({ error: 'Failed to fetch properties'+query.id });
  }
}
