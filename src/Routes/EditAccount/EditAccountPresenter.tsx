import Button from "components/Button";
import Form from "components/Form";
import Header from "components/Header";
import Input from "components/Input";
import PhotoInput from "components/PhotoInput";
import React from "react";
import { MutationFn } from "react-apollo";
import Helmet from "react-helmet";
import styled from "../../typed-components";

const Container = styled.div`
  text-align: center;
`;

const ExtendedForm = styled(Form)`
  padding: 0px 40px;
`;

const ExtendedInput = styled(Input)`
  margin-bottom: 30px;
`;

interface IProps {
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto: string;
  onSubmit?: MutationFn;
  onInputChange: React.ChangeEventHandler<HTMLInputElement>;
  loading?: boolean;
  uploading: boolean;
}

const EditAccountPresenter: React.SFC<IProps> = ({
  firstName,
  lastName,
  email,
  profilePhoto,
  onSubmit,
  onInputChange,
  loading,
  uploading
}) => (
  <Container>
    <Helmet>
      <title>Edit Account | Newber</title>
    </Helmet>
    <Header title="Edit Account" backTo={"/"}/>
    <ExtendedForm submitFn={onSubmit}>
      <PhotoInput 
        uploading={uploading}
        photoUrl={profilePhoto}
        onChange={onInputChange}
      />
      <ExtendedInput
        onChange={onInputChange}
        type="text"
        value={firstName}
        placeholder="First Name"
        name="firstName"
      />
      <ExtendedInput
        onChange={onInputChange}
        type="text"
        value={lastName}
        placeholder="Last Name"
        name="lastName"
      />
      <ExtendedInput
        onChange={onInputChange}
        type="email"
        value={email}
        placeholder="Email"
        name="email"
      />
      <Button onClick={null} value={loading ? "Loading" : "Update"}/>
    </ExtendedForm>
  </Container>
);

export default EditAccountPresenter;