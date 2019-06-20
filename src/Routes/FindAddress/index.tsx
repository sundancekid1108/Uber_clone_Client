import { GoogleApiWrapper } from "google-maps-react";
import FindAddressContainer from "./FindAddressContainer";
import { GOOGLE_API_KEY } from "../../secretKey";

import dotenv from "dotenv";
dotenv.config();

export default GoogleApiWrapper({
  apiKey: GOOGLE_API_KEY
  // apiKey: process.env.GOOGLE_API_KEY
})(FindAddressContainer);
