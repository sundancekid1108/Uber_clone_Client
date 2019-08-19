import GlobalStyle from "global-styles";
import React, { Fragment } from "react";
import { graphql } from "react-apollo";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { theme } from 'theme';
import { ThemeProvider } from 'typed-components';
import AppPresenter from './AppPresenter';
import { IS_LOGGED_IN } from "./AppQueries";

const AppContainer : any = ({ data })  => (
  <Fragment>
    <GlobalStyle/>
    <ThemeProvider theme={theme}>
      <AppPresenter isLoggedIn={data.auth.isLoggedIn}/>
    </ThemeProvider>
    <ToastContainer draggable={true} position="bottom-center" />
  </Fragment>
);

export default graphql(IS_LOGGED_IN)(AppContainer);