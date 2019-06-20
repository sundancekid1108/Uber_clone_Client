import { GoogleApiWrapper } from "google-maps-react";
import { GOOGLE_API_KEY } from "../../secretKey";
import HomeContainer from "./HomeContainer";
import dotenv from "dotenv";
dotenv.config();

export default GoogleApiWrapper({
  apiKey: GOOGLE_API_KEY
  // apiKey: process.env.REACT_APP_GOOGLE_API_KEY
})(HomeContainer);
