import Button from "components/Button";
import Form from "components/Form";
import Header from "components/Header";
import Input from "components/Input";
import React from "react";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import styled from "../../typed-components";

const Container = styled.div`
  padding: 0 40px;
`;

const ExtendedInput = styled(Input)`
  margin-bottom: 40px;
`;

const ExtendedLink = styled(Link)`
  display: block;
  text-decoration: underline;
  margin-bottom: 20px;
`;

interface IProps {
  address: string;
  name: string;
  onInputChange: React.ChangeEventHandler<HTMLInputElement>;
  loading: boolean;
  onSubmit: () => void;
}

const AddPlacePresenter: React.SFC<IProps> = ({
  onInputChange,
  address,
  name,
  loading,
  onSubmit
}) => (
  <React.Fragment>
    <Helmet>
      <title>Add Place | Newber</title>
    </Helmet>
    <Header title="Add Place" backTo="/"/>
    <Container>
      <Form submitFn={onSubmit}>
        <ExtendedInput
          placeholder="Name"
          type="text"
          onChange={onInputChange}
          value={name}
          name="name"
        />
        <ExtendedInput
          placeholder="Address"
          type="text"
          onChange={onInputChange}
          value={address}
          name="address"
        />
        <ExtendedLink to="/find-address">Pick place from map</ExtendedLink>
        <Button onClick={null} value={loading ? "Adding place" : "Add Place"}/>
      </Form>
    </Container>
  </React.Fragment>
);

export default AddPlacePresenter;