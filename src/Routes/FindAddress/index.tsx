import { GoogleApiWrapper } from "google-maps-react";
import FindAddressContainer from "./FindAddressContainer";

export default GoogleApiWrapper({
  apiKey: process.env.GOOGLE_API_KEY
})(FindAddressContainer);
