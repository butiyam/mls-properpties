// types.ts
export interface PropertyData {
  ListingKey: string;  // required
  lat: number;
  lng: number;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  address: string;
  image: string;
}
