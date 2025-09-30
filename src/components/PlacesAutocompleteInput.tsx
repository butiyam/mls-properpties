import React, {  useRef } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"];

type Address = {
  streetnumber: string;
  streetname: string;
  city: string;
  state: string;
  postalcode: string;
};

type Props = {
  inputValue: string;
  setInputValue: (v: string) => void;
  onAddressSelect: (address: Address[]) => void;
};

const PlacesAutocompleteInput: React.FC<Props> = ({ inputValue, setInputValue, onAddressSelect }) => {

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    libraries: libraries as any[],
  });

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

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
  
  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      let selectedAddress = "";
      
      if (place.formatted_address) {
        //console.log(place)
        selectedAddress = place.formatted_address;
      } else if (place.name) {
        selectedAddress = place.name;
      }
      setInputValue(selectedAddress);
      onAddressSelect(extractCityStateCountry(place.address_components || [])); // Pass selection to parent
     console.log("Selected place:", place);
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <Autocomplete className="w-full"  onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
      <input
        type="text"
        placeholder="Oak Brook, IL, USA"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className = "text-[#e6f1c6] w-full h-16 px-6 py-3 text-xl outline-none border-none rounded-none bg-white flex-1"
      />
    </Autocomplete>
  );
};

export default PlacesAutocompleteInput;
