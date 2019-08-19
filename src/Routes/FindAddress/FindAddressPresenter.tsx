import AddressBar from "components/AddressBar";
import Button from "components/Button";
import React from "react";
import Helmet from "react-helmet";
import styled from "../../typed-components";

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

const Map = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
`;

const CenterPoint = styled.div`
  position: absolute;
  width: 2rem;
  height: 2rem;
  z-index: 2;
  font-size: 2rem;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

interface IProps {
  mapRef: any;
  address: string;
  onInputBlur: () => void;
  onPickPlace: () => void;
  onInputChange: React.ChangeEventHandler<HTMLInputElement>;
}

class FindAddressPresenter extends React.Component<IProps> {
  public render() {
    const { 
      mapRef, 
      address, 
      onInputChange, 
      onInputBlur,
      onPickPlace,
    } = this.props;
    return (
      <div>
        <Helmet>
          <title>Find Address | Newber</title>
        </Helmet>
        <ExtendedButton value="Pick this place" onClick={onPickPlace}/>
        <CenterPoint>📍</CenterPoint>
        <Map ref={mapRef}/>
        <AddressBar
          onBlur={onInputBlur}
          onChange={onInputChange}
          value={address}
          name="address"
        />
      </div>
    );
  }
}

export default FindAddressPresenter;