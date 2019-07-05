import React from "react";
import {MutationFn} from "react-apollo";
import Helmet from "react-helmet";
import Sidebar from "react-sidebar";
import AddressBar from "../../Components/AddressBar";
import Button from "../../Components/Button";
import Menu from "../../Components/Menu";
import RidePopUp from "../../Components/RidePopUp";
import styled from "../../typed-components";
import { 
  userProfile,
  getRides,
  requestRide,
  requestRideVariables,
  acceptRide,
  acceptRideVariables
} from "../../types/api";

const Container = styled.div``;

const MenuButton = styled.button`
  appearance: none;
  padding: 10px;
  position: absolute;
  top: 10px;
  left: 10px;
  text-align: center;
  font-weight: 800;
  border: 0;
  cursor: pointer;
  font-size: 20px;
  transform: rotate(90deg);
  z-index: 2;
  background-color: transparent;
`;

const Map = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`;


const ExtendedButton = styled(Button)`
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 10;
  height: auto;
  width: 80%;
`;

const RequestButton = styled(ExtendedButton)`
  bottom: 250px;
`;

interface IProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  loading: boolean;
  mapRef: any;
  toAddress: string;
  onAddressSubmit: () => void;
  price: number;
  data?: userProfile;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  requestRideMutation?: MutationFn;
  nearbyRide?: getRides | undefined;
  acceptRideMutation?: MutationFn<acceptRide, acceptRideVariables>;
 
}

const HomePresenter: React.SFC<IProps> = ({
  isMenuOpen,
  toggleMenu,
  loading,
  toAddress,
  mapRef,
  onInputChange,
  onAddressSubmit,
  price,
  requestRideMutation,
  data: { GetMyProfile: { user = null } = {} } = {GetMyProfile:{}},
  nearbyRide: { GetNearbyRide } = { GetNearbyRide: null},
  acceptRideMutation
}) => (
  <Container>
    <Helmet>
      <title>Home | Newber</title>
    </Helmet>
    <Sidebar
      sidebar={<Menu/>}
      open={isMenuOpen}
      onSetOpen={toggleMenu}
      styles={{
        sidebar: {
          background: "white",
          width: "80%",
          zIndex: "10"
        }
      }}
    >
      {!loading && (<MenuButton onClick={toggleMenu}>
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M24 18v1h-24v-1h24zm0-6v1h-24v-1h24zm0-6v1h-24v-1h24z" fill="#1040e2"/><path d="M24 19h-24v-1h24v1zm0-6h-24v-1h24v1zm0-6h-24v-1h24v1z"/></svg>
      </MenuButton>)}
      {user && !user.isDriving && (
        <React.Fragment>
          <AddressBar
            name="toAddress"
            onChange={onInputChange}
            value={toAddress}
            onBlur={() => ""}
          />
          <ExtendedButton
            onClick={onAddressSubmit}
            disabled={toAddress === ""}
            value={price ? "Change address" : "Pick Address"}
          />
        </React.Fragment>
      )}
      {!price ? false : (
        <RequestButton
          onClick={requestRideMutation}
          disabled={toAddress === ""}
          value={`Request Ride ($${price})`}
        />
      )}

      {GetNearbyRide && GetNearbyRide.ride && (
        <RidePopUp
          id={GetNearbyRide.ride.id}
          pickUpAddress={GetNearbyRide.ride.pickUpAddress}
          dropOffAddress={GetNearbyRide.ride.dropOffAddress}
          price={GetNearbyRide.ride.price}
          distance={GetNearbyRide.ride.distance}
          passengerName={GetNearbyRide.ride.passenger.fullName || ""}
          passengerPhoto={GetNearbyRide.ride.passenger.profilePhoto || ""}
          acceptRideMutation={acceptRideMutation}
        />
      )}  

      <Map ref={mapRef}/>
    </Sidebar>
  </Container>
);

export default HomePresenter;
