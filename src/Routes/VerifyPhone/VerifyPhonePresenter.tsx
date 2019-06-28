import React from "react";
import { MutationFn } from "react-apollo";
import Helmet from "react-helmet";
import Button from "../../Components/Button";
import Form from "../../Components/Form";
import Header from "../../Components/Header";
import Input from "../../Components/Input";
import styled from "../../typed-components";
import { verifyPhone, verifyPhoneVariables } from "../../types/api";

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
  onSubmit: MutationFn<verifyPhone, verifyPhoneVariables>;
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
      <title>Verify Phone | Newber</title>
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
        value={loading ? "Verifying" : "Submit"}
        onClick={null}
      />
    </ExtendedForm>
  </Container>
);

export default VerifyPhonePresenter;
