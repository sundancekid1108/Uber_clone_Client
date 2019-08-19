import Header from "components/Header";
import Place from "components/Place";
import React from "react";
import { MutationFn } from "react-apollo";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import styled from "../../typed-components";
import { getPlaces, userProfile } from "../../types/api";

const Container = styled.div`
  padding: 0px 40px;
`;

const Image = styled.img`
  height: 60px;
  width: 60px;
  border-radius: 50%;
`;

const GridLink = styled(Link)`
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-gap: 10px;
  margin-bottom: 10px;
`;

const Keys = styled.div``;

const Key = styled.span`
  display: block;
  cursor: pointer;
`;

const FakeLink = styled.span`
  text-decoration: underline;
  cursor: pointer;
`;

const StyledLink = styled(Link)`
  display: block;
  text-decoration: underline;
  margin: 20px 0;
`;

interface IProps {
  logUserOut: MutationFn;
  userData?: userProfile;
  userDataLoading: boolean;
  placesData?: getPlaces;
  placesLoading: boolean;
}

const SettingsPresenter: React.SFC<IProps> = ({
  logUserOut,
  userData: { GetMyProfile: { user = null } = {} }= { GetMyProfile: {} },
  placesData: { GetMyPlaces: { places = null } = {} } = { GetMyPlaces: {} },
  userDataLoading,
  placesLoading
}) => (
  <React.Fragment>
    <Helmet> 
      <title>Settings | Newber</title>
    </Helmet>
    <Header title="Account Settings" backTo="/"/>
    <Container>
      <GridLink to="/edit-account">
        {!userDataLoading &&
          user &&
          user.profilePhoto &&
          user.email &&
          user.fullName && (
            <React.Fragment>
              <Image src={user.profilePhoto}/>
              <Keys> 
                <Key>{user.fullName}</Key>
                <Key>{user.email}</Key>
              </Keys>
            </React.Fragment>
          )
        }
      </GridLink>
      {!placesLoading &&
        places &&
        places.map(place => (
          <Place 
            key={place!.id}
            name={place!.name} 
            address={place!.address}
            fav={place!.isFav}
            id={place!.id}
          />
        ))
      }
      <StyledLink to ="/places">Go to Places</StyledLink>
      <FakeLink onClick={() => logUserOut()}>Log Out</FakeLink>
    </Container>
  </React.Fragment>
);

export default SettingsPresenter;