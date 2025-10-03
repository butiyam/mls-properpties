import { GoogleMap, OverlayView, InfoWindow, useJsApiLoader  } from '@react-google-maps/api';
import React, { useState } from 'react';
import { PropertyData } from '@/lib/types';

const containerStyle = {
  width: '100%',
  height: '100%',
};


type Address = {
  streetnumber: string;
  streetname: string;
  city: string;
  state: string;
  postalcode: string;
};

interface MapWithInfoWindowProps {
   onSelectLocation: (address: Address[]) => void;
  properties: PropertyData[];
    onClose: () => void;
}

function formatPriceShort(amount: number): string {
  if (amount >= 1_000_000_000) {
    return (amount / 1_000_000_000).toFixed(1) + "B";
  } else if (amount >= 1_000_000) {
    return (amount / 1_000_000).toFixed(1) + "M";
  } else if (amount >= 1_000) {
    return (amount / 1_000).toFixed(1) + "K";
  } else {
    return amount.toString();
  }
}


export default function PropertyMap({ onSelectLocation, properties, onClose }: MapWithInfoWindowProps) {

  const center = properties.length > 0
  ? { lat: properties[0].lat, lng: properties[0].lng }
  : { lat: 41.850033, lng: -87.6500523 }; // fallback center
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);
  const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;


  
 const extractCityStateCountry = (addressComponents: google.maps.GeocoderAddressComponent[] = []) => {
    let streetname = "";
    let streetnumber = "";
    let postalcode = "";
    let city = "";
    let state = "";
  

    addressComponents.forEach((component) => {
      if (component.types.includes("route")) streetname = component.long_name;
      if (component.types.includes("street_number")) streetnumber = component.long_name;
      if (component.types.includes("postal_code")) postalcode = component.long_name;
      if (component.types.includes("locality")) city = component.long_name;
      if (component.types.includes("administrative_area_level_1")) state = component.short_name;
     
    });

    return [{ streetnumber, streetname, city, state, postalcode }];
  };

   const handleClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        console.log(results[0]['address_components'])
        //extractCityStateCountry(results[0]['address_components'])
        onSelectLocation(extractCityStateCountry(results[0]['address_components']));
      }
    });
  };


  if (!googleApiKey) {
    throw new Error("Google Maps API key is missing in environment variables");
  }

   const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps...</div>;
  }

  return (
     <div className="relative w-full h-full">
      {/* Close button: absolute & very high z-index, pointer events enabled */}
      <div style={{ position: "absolute", top: 12, right: 12, zIndex: 99999 }}>
        <button
          onClick={() => { onClose(); }}
          className="bg-red-600 text-white px-3 py-1 rounded shadow"
          style={{ pointerEvents: "auto" }}
        >
          ✖ Close
        </button>
      </div>
      
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}  onClick={handleClick} >
      {properties.map((property, index) => (
        <OverlayView
          key={index}
          position={{ lat: property.lat, lng: property.lng }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
       
        >
          <div
              onClick={(e) => {
                e.stopPropagation();  // Prevent map click event
                setSelectedProperty(property);
              }}
            style={{
              width: '50px',
              backgroundColor: "#375fae",
              color: "white",
              padding: "10px 10px 10px 10px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              userSelect: "none",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              whiteSpace: "nowrap",
              transform: "translate(-50%, -100%)", // Pin the bottom center
            }}
          >
          {  formatPriceShort(property.price) }
          </div>
        </OverlayView>
      ))}

      {selectedProperty && (
        <InfoWindow
          position={{ lat: selectedProperty.lat, lng: selectedProperty.lng }}
          onCloseClick={() => setSelectedProperty(null)}
        >
          <a href={`/property-details/${selectedProperty.ListingKey}`}>
          <div style={{ width: 200, fontFamily: "Arial, sans-serif" }}>
            <img
              src={selectedProperty.image}
              alt="Property"
              style={{ width: "100%", borderRadius: 8, marginBottom: 8 }}
            />
            <h3 style={{ color:'#000', margin: "0 0 8px 0" }}>
              {new Intl.NumberFormat("en-US", {style: "currency", currency: "USD", maximumFractionDigits: 0,}).format(Number(selectedProperty.price))}
            </h3>
            <p style={{ color:'#333333', margin: "0 0 4px 0" }}>
              {selectedProperty.beds} Beds &bull; {selectedProperty.baths} Baths &bull; {selectedProperty.sqft} sqft
            </p>
            <p style={{ fontSize: 14, color: "#333333", margin: 0 }}>{selectedProperty.address}</p>
          </div>
          </a>
        </InfoWindow>
      )}
    </GoogleMap>
    </div>
  );
}