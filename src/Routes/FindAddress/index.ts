import dotenv from "dotenv";
import { GoogleApiWrapper } from "google-maps-react";
import FindAddressContainer from "./FindAddressContainer";

dotenv.config();

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
})(FindAddressContainer);