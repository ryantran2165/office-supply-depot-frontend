import React, { Component } from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import RestrictedRoute from "./components/restricted-route";
import { connect } from "react-redux";
import { checkSignedIn, checkDriverSignedIn } from "./actions/auth-actions";
import Navigation from "./components/navigation/navigation";
import Home from "./components/home/home";
import Products from "./components/products/products";
import SignIn from "./components/account/sign-in";
import SignUp from "./components/account/sign-up";
import Account from "./components/account/account";
import Cart from "./components/cart/cart";
import DriverSignIn from "./components/driver/driver-sign-in";
import DriverNavigation from "./components/driver/driver-navigation";
import Driver from "./components/driver/driver";

export const IS_LOCAL = false;
export const API_URL = IS_LOCAL
  ? "http://localhost:8000"
  : "https://office-supply-depot-backend.herokuapp.com";

class App extends Component {
  componentDidMount() {
    this.props.checkSignedIn();
    this.props.checkDriverSignedIn();
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/products">
            <React.Fragment>
              <Navigation />
              <Products />
            </React.Fragment>
          </Route>
          <RestrictedRoute
            path="/sign-in"
            component={SignIn}
            allowSignedIn={false}
            redirect="/account"
            signedIn={this.props.signedIn}
            navigation={Navigation}
          />
          <RestrictedRoute
            path="/sign-up"
            component={SignUp}
            allowSignedIn={false}
            redirect="/account"
            signedIn={this.props.signedIn}
            navigation={Navigation}
          />
          <RestrictedRoute
            path="/account"
            component={Account}
            allowSignedIn={true}
            redirect="/sign-in"
            signedIn={this.props.signedIn}
            navigation={Navigation}
          />
          <RestrictedRoute
            path="/cart"
            component={Cart}
            allowSignedIn={true}
            redirect="/sign-in"
            signedIn={this.props.signedIn}
            navigation={Navigation}
          />
          <RestrictedRoute
            path="/driver-sign-in"
            component={DriverSignIn}
            allowSignedIn={false}
            redirect="/driver"
            signedIn={this.props.driverSignedIn}
          />
          <RestrictedRoute
            path="/driver"
            component={Driver}
            allowSignedIn={true}
            redirect="/driver-sign-in"
            signedIn={this.props.driverSignedIn}
            navigation={DriverNavigation}
          />
          <Route path="/">
            <React.Fragment>
              <Navigation />
              <Home />
            </React.Fragment>
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  signedIn: PropTypes.bool,
  checkSignedIn: PropTypes.func,
  driverSignedIn: PropTypes.bool,
  checkDriverSignedIn: PropTypes.func,
};

const mapStateToProps = (state) => ({
  signedIn: state.auth.signedIn,
  driverSignedIn: state.auth.driverSignedIn,
});

export default connect(mapStateToProps, { checkSignedIn, checkDriverSignedIn })(
  App
);
