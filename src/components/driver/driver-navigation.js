import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { driverSignOut } from "../../actions/auth-actions";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

class DriverNavigation extends Component {
  render() {
    return (
      <Navbar className="justify-content-center pt-3" bg="light" expand="md">
        <Link className="navbar-brand" to="/">
          Office Supply Depot
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ml-auto">
            <Navbar.Text>
              Hi{" "}
              {this.props.driver !== null ? this.props.driver.first_name : ""}
            </Navbar.Text>
            <Nav.Item>
              <Link
                className="nav-link"
                to="/driver-signin"
                onClick={this.props.driverSignOut}
              >
                Sign out
              </Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

DriverNavigation.propTypes = {
  driver: PropTypes.object,
  driverSignOut: PropTypes.func,
};

const mapStateToProps = (state) => ({
  driver: state.auth.driver,
});

export default connect(mapStateToProps, { driverSignOut })(DriverNavigation);
