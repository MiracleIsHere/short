import {
  HOME,
  APP_LOGIN,
  APP_SIGNUP,
  SHORT
} from './util/routes';
import './App.css';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
//React
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
//MUI
import { ThemeProvider } from "@material-ui/styles";
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
// Redux
import { Provider } from 'react-redux';
import store from './redux/store';
//React
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';
// Components
import Navbar from './components/layout/Navbar';
import themeObject from './util/theme';
import AuthRoute from './util/AuthRoute';
// Pages
import home from './pages/home';
import auth from './pages/auth';
import link from './pages/link';

const theme = createMuiTheme(themeObject);

axios.defaults.baseURL =
  "top secret api";

const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
    window.location.href = APP_LOGIN;
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}

//Set after login redirect destination
let redirectAfterAuth;
const regEx = /^(\/[a-zA-Z0-9_-]+)(\+?)$/; // /shortId || /shortId+
if (window.location.pathname.match(regEx)) redirectAfterAuth = window.location.pathname
else redirectAfterAuth = HOME;

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Router >
            <Navbar />
            <div className="container">
              <Switch >
                <Route exact path={HOME} component={home} />
                <AuthRoute exact path={APP_LOGIN} component={auth}
                  compProps={{ redirect: redirectAfterAuth }} />
                <AuthRoute exact path={APP_SIGNUP} component={auth}
                  compProps={{ redirect: redirectAfterAuth }} />
                <Route exact path={SHORT} component={link} />
              </Switch>
            </div>
          </Router>
        </Provider>
      </ThemeProvider>
    );
  }
}
export default App;