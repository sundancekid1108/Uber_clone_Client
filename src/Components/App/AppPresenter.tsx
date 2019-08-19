import PropTypes from "prop-types";
import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import AddPlaces from "routes/AddPlace";
import Chat from 'routes/Chat';
import EditAccount from "routes/EditAccount";
import FindAddress from "routes/FindAddress";
import Home from "routes/Home";
import Login from "routes/Login";
import PhoneLogin from "routes/PhoneLogin";
import Places from "routes/Places";
import Ride from "routes/Ride";
import Settings from "routes/Settings";
import SocialLogin from "routes/SocialLogin";
import VerifyPhone from "routes/VerifyPhone";

interface IProps {
  isLoggedIn: boolean;
}

const LoggedOutRoutes: React.SFC = () => (
  <Switch>
    <Route path={"/"} exact={true} component={Login}/>
    <Route path={"/phone-login"} exact={true} component={PhoneLogin}/>
    <Route path={"/verify-phone"} exact={true} component={VerifyPhone}/>
    <Route path={"/social-login"} exact={true} component={SocialLogin}/>
    <Redirect from={"*"} to={"/"} />
  </Switch>
);


const LoggedInRouter: React.SFC = () => (
  <Switch>
    <Route path={"/"} exact={true} component={Home}/>
    <Route path={"/ride/:rideId"} exact={true} component={Ride}/>
    <Route path={"/chat/:chatId"} exact={true} component={Chat}/>
    <Route path={"/edit-account"} exact={true} component={EditAccount}/>
    <Route path={"/settings"} exact={true} component={Settings}/>
    <Route path={"/places"} exact={true} component={Places}/>
    <Route path={"/add-place"} exact={true} component={AddPlaces}/>
    <Route path={"/find-address"} exact={true} component={FindAddress}/>
    <Redirect from={"*"} to={"/"} />
  </Switch>
);

const AppPresenter: React.SFC<IProps> = ({ isLoggedIn }) => (
  <BrowserRouter>
    { isLoggedIn ? <LoggedInRouter/> : <LoggedOutRoutes/> }
  </BrowserRouter>
);

AppPresenter.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired
}

export default AppPresenter;