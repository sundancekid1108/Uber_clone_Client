import Header from "components/Header";
import Place from "components/Place";
import React from "react";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import styled from "../../typed-components";
import { getPlaces } from "../../types/api";

const Container = styled.div`
  padding: 0 40px;
`;

const SLink = styled(Link)`
  text-decoration: underline;
`;

interface IProps {
  data?: getPlaces;
  loading: boolean;
}

const PlacesPresenter: React.SFC<IProps> = ({
  data: { GetMyPlaces: { places = null } = {} } = { GetMyPlaces: {} },
  loading
}) => (
  <React.Fragment>
    <Helmet>
      <title>Places | Newber</title>
    </Helmet>
    <Header title="Places" backTo="/"/>
    <Container>
      {!loading &&
        places &&
        places.length === 0 
        ? <p>You have no Places</p>
        : places && places!.map(place => <Place
          key={place!.id}
          fav={place!.isFav}
          name={place!.name}
          address={place!.address}
          id={place!.id}
        />)
      }
      <SLink to="/add-place">Place add some places!</SLink>
    </Container>
  </React.Fragment>
)

export default PlacesPresenter;