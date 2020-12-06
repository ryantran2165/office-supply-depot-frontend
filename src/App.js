import React, { Component } from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import RestrictedRoute from "./components/restricted-route";
import { connect } from "react-redux";
import { checkSignedIn, checkDriverSignedIn } from "./actions/auth-actions";
import Navigation from "./components/navigation/navigation";
import Home from "./components/home/home";
import Products from "./components/products/products";
import Product from "./components/products/product";
import Signin from "./components/account/signin";
import Signup from "./components/account/signup";
import Account from "./components/account/account";
import Cart from "./components/cart/cart";
import Checkout from "./components/checkout/checkout";
import DriverSignIn from "./components/driver/driver-signin";
import DriverNavigation from "./components/driver/driver-navigation";
import Driver from "./components/driver/driver";

export const IS_LOCAL = false;
export const API_URL = IS_LOCAL
  ? "http://localhost:8000"
  : "https://office-supply-depot-backend.herokuapp.com";
export const GOOGLE_MAPS_API_KEY = "AIzaSyCvNOUWjkIi8V_jKReYrhrNSSHDnVKn2K8";

class App extends Component {
  componentDidMount() {
    this.props.checkSignedIn();
    this.props.checkDriverSignedIn();
  }

  render() {
    return (
      <React.Fragment>
        <BrowserRouter>
          <Switch>
            <Route path="/products/:id">
              <React.Fragment>
                <Navigation />
                <Product />
              </React.Fragment>
            </Route>
            <Route path="/products">
              <React.Fragment>
                <Navigation />
                <Products />
              </React.Fragment>
            </Route>
            <RestrictedRoute
              path="/signin"
              component={Signin}
              allowSignedIn={false}
              redirect="/"
              signedIn={this.props.signedIn}
              navigation={Navigation}
            />
            <RestrictedRoute
              path="/signup"
              component={Signup}
              allowSignedIn={false}
              redirect="/"
              signedIn={this.props.signedIn}
              navigation={Navigation}
            />
            <RestrictedRoute
              path="/account"
              component={Account}
              allowSignedIn={true}
              redirect="/signin"
              signedIn={this.props.signedIn}
              navigation={Navigation}
            />
            <RestrictedRoute
              path="/cart"
              component={Cart}
              allowSignedIn={true}
              redirect="/signin"
              signedIn={this.props.signedIn}
              navigation={Navigation}
            />
            <RestrictedRoute
              path="/checkout"
              component={Checkout}
              allowSignedIn={true}
              redirect="/signin"
              signedIn={this.props.signedIn}
              navigation={Navigation}
            />
            <RestrictedRoute
              path="/driver-signin"
              component={DriverSignIn}
              allowSignedIn={false}
              redirect="/driver"
              signedIn={this.props.driverSignedIn}
            />
            <RestrictedRoute
              path="/driver"
              component={Driver}
              allowSignedIn={true}
              redirect="/driver-signin"
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
        <footer className="text-center mt-auto p-3">
          <h5>Made by Ryan Tran, Thanh Tran, and Aaron Smith</h5>
          <h5>*** This is not a real site! ***</h5>
        </footer>
      </React.Fragment>
    );
  }
}

export function getAuthHeader() {
  return {
    headers: {
      Authorization: `JWT ${localStorage.getItem("token")}`,
    },
  };
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

export default connect(mapStateToProps, {
  checkSignedIn,
  checkDriverSignedIn,
})(App);
