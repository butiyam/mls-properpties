"use client";
import React from "react";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";

type Props = {
  onSelectLocation: (address: string) => void;
  onClose: () => void;
};

export default function PropertyMap({ onSelectLocation, onClose }: Props) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extractCityStateCountry = (addressComponents: any[]) => {
    let city = '';
    let state = '';
    let country = '';

    addressComponents.forEach((component) => {
      if (component.types.includes("locality")) {
        city = component.long_name;
      }
      if (component.types.includes("administrative_area_level_1")) {
        state = component.short_name; // e.g. IL
      }
      if (component.types.includes("country")) {
        country = component.short_name; // e.g. US
      }
    });

    return `${city}, ${state}, ${country}`;
  };


  const center = { lat: 41.8398, lng: -87.9280 };

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

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="relative w-full h-full">
      {/* Close button: absolute & very high z-index, pointer events enabled */}
      <div style={{ position: "absolute", top: 12, right: 12, zIndex: 99999 }}>
        <button
          onClick={() => {
            console.log("Map close clicked");
            onClose();
          }}
          className="bg-red-600 text-white px-3 py-1 rounded shadow"
          style={{ pointerEvents: "auto" }}
        >
          ✖ Close
        </button>
      </div>

      {/* Map below the button */}
      <div style={{ width: "100%", height: "100%" }}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%", position: "relative", zIndex: 0 }}
          center={center}
          zoom={11}
          onClick={handleClick}
        >
          <Marker position={center} />
        </GoogleMap>
      </div>
    </div>
  );
}
