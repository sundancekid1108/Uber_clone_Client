import Button from "components/Button";
import Form from "components/Form";
import Header from "components/Header";
import Input from "components/Input";
import React from "react";
import { MutationFn } from "react-apollo";
import Helmet from "react-helmet";
import styled from "../../typed-components";
import { verfiyPhone, verfiyPhoneVariables } from "../../types/api";

const Container = styled.div``;

const ExtendedForm = styled(Form)`
  padding: 0px 40px;
`;

const ExtendedInput = styled(Input)`
  margin-bottom: 20px;
`;

interface IProps {
  verificationCode: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>
  onSubmit: MutationFn<verfiyPhone, verfiyPhoneVariables>;
  loading: boolean;
}

const VerifyPhonePresenter: React.SFC<IProps> = ({ 
  verificationCode, 
  onChange,
  onSubmit,
  loading
}) => (
  <Container>
    <Helmet>
      <title>Verify Phone | Number</title>
    </Helmet>
    <Header backTo={"/phone-login"} title={"Verify Phone Number"} />
    <ExtendedForm submitFn={onSubmit}>
      <ExtendedInput
        value={verificationCode}
        placeholder={"Enter Verification Code"}
        onChange={onChange}
        name="verificationCode"
      />
      <Button
        disabled={loading}
        value={loading ? "Verifing": "Submit"}
        onClick={null}
      />
    </ExtendedForm>
  </Container>
);

export default VerifyPhonePresenter;