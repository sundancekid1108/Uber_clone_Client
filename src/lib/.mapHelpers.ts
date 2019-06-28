import axios from "axios";
import { GOOGLE_API_KEY } from "../secretKey";
import { toast } from "react-toastify";

import dotenv from "dotenv";
dotenv.config();

const GOOGLEMAP_API_KEY = GOOGLE_API_KEY;

export const geoCode = async (address: string) => {
  const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLEMAP_API_KEY}`;
  const { data } = await axios(URL);
  console.log(data);
  if (!data.error_message) {
    const { results } = data;
    const firstPlace = results[0];
    const {
      formatted_address,
      geometry: {
        location: { lat, lng }
      }
    } = firstPlace;
    return { formatted_address, lat, lng };
  } else {
    toast.error(data.error_message);
    return false;
  }
};

export const reverseGeoCode = async (lat: number, lng: number) => {
  const URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLEMAP_API_KEY}`;
  const { data } = await axios(URL);
  if (!data.error_message) {
    const { results } = data;
    const firstPlace = results[0];
    if (!firstPlace) {
      return false;
    }
    const address = firstPlace.formatted_address;
    return address;
  } else {
    toast.error(data.error_message);
    return false;
  }
};
