import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { checkSignedIn } from "./actions/auth-actions";
import Navigation from "./components/navigation/navigation";

export const IS_LOCAL = false;
export const API_URL = IS_LOCAL
  ? "http://localhost:8000"
  : "https://office-supply-depot-backend.herokuapp.com";

class App extends Component {
  componentDidMount() {
    this.props.checkSignedIn();
  }

  render() {
    return <Navigation />;
  }
}

App.propTypes = {
  checkSignedIn: PropTypes.func,
};

export default connect(null, { checkSignedIn })(App);
