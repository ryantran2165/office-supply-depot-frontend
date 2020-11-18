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
      <Navbar className="shadow-sm pt-3 px-md-5" bg="light" expand="md">
        <Link className="navbar-brand" to="/">
          <img
            src="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"
            width="75"
            height="75"
            alt="OSD logo"
          />
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse className="mt-3 mt-md-0">
          <Nav className="ml-auto">
            <Navbar.Text className="mr-1">
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
