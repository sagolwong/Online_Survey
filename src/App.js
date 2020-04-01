import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { connect } from 'react-redux';
import PropTypes from "prop-types";

import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import store from "./store";
import PrivateRoute from "./components/private-route/PrivateRoute";

import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import Footer from './components/layout/Footer'
import Landing from './components/layout/Landing'
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Requests from './views/Requests';
import UserProfile from './views/UserProfile';
import ErrorPage from './components/error/ErrorPage';
import PrivateResearcherRoute from './components/private-route/PrivateResearcherRoute';
import CreateProject from './views/CreateProject';

// Check for token to keep user logged in
if (localStorage.jwtOSToken) {
  // Set auth token header auth
  const token = localStorage.jwtOSToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}

class App extends Component {

  showComponent() {
    if (this.props.statusPage.blankPage) return
    else if (!this.props.statusPage.blankPage) return <Sidebar />
  }

  renderRouter() {
    return (
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <PrivateRoute exact path="/requests" component={Requests} />
        <PrivateRoute exact path="/user-profile" component={UserProfile} />
        <PrivateRoute exact path="/error-page" component={ErrorPage} />
        <PrivateResearcherRoute exact path="/create-project" component={CreateProject} />
      </Switch>
    )
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Navbar />
          {this.showComponent()}
          {this.renderRouter()}
        </div>
        {console.log(this.props.statusPage)}
        {console.log(this.props.auth.user)}
      </BrowserRouter>
    )
  }
}
App.propTypes = {
  auth: PropTypes.object.isRequired,
  statusPage: PropTypes.object.isRequired
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  statusPage: state.statusPage
});
export default connect(mapStateToProps)(App);
