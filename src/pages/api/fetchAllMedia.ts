import db from '../../lib/dbConnect';
import { RowDataPacket } from 'mysql2';

 export default async function fetchAllMedia() {
 const INITIAL_URL = "https://images-listings.coldwellbanker.com/MLSNI/"; 
                     //"12/45/66/36/_P/12456636_P01.jpg?width=1024";
 const [rows] = await db.query<RowDataPacket[]>(`SELECT ListingKey, PhotosCount FROM properties WHERE Media IS NULL;`);

for (const row of rows) {
  console.log(row.PhotosCount);
    const uploadedUrls: string[] = [];
  for(let k = 0; k < Number(row.PhotosCount); k++){
    const listingkey = row.ListingKey;
    const cleanedKey = listingkey.replace('MRD', ''); 
    const formatted = cleanedKey.match(/.{1,2}/g)?.join('/') + '/';   
    const url = INITIAL_URL+formatted+'_P/'+cleanedKey+"_P0"+k+".jpg?width=1024";
    uploadedUrls.push(url);
    
 }
       // Save uploaded URLs to DB
      await db.query('UPDATE properties SET Media = ? WHERE ListingKey = ?', [
        JSON.stringify(uploadedUrls),
        row.ListingKey
      ]);
    console.log(uploadedUrls)
      await new Promise(res => setTimeout(res, 50)); // 50ms pause

}

 console.log(`🎉 Finished! All Records`);
  return 0;

}

(async () => {
  await fetchAllMedia();
 
})();
