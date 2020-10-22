import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../actions/auth-actions";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import NavDropdown from "react-bootstrap/NavDropdown";
import { FaSearch } from "react-icons/fa";

class Navigation extends Component {
  render() {
    return (
      <Navbar bg="light" expand="md" className="justify-content-center pt-3">
        <Link to="/" className="navbar-brand">
          Office Supply Depot
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="mt-3 mt-md-0">
          <Nav className="mx-auto">
            <Form inline>
              {/*Dropdown for non-mobile only*/}
              <Dropdown className="d-none d-md-block">
                <Dropdown.Toggle id="search-dropdown" />
                <Dropdown.Menu>
                  <Dropdown.Item>Office Supplies</Dropdown.Item>
                  <Dropdown.Item>Furniture</Dropdown.Item>
                  <Dropdown.Item>Cleaning</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <FormControl type="text" placeholder="Search" id="search-box" />
              <Button id="search-button">
                <FaSearch />
              </Button>
            </Form>
            {/*Dropdown for mobile only*/}
            <NavDropdown
              title="Products"
              id="basic-nav-dropdown"
              className="d-md-none"
            >
              <NavDropdown.Item>Office Supplies</NavDropdown.Item>
              <NavDropdown.Item>Furniture</NavDropdown.Item>
              <NavDropdown.Item>Cleaning</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Item>
              {this.props.signedIn && this.props.user !== null ? (
                <Link to="/account" className="nav-link">
                  Hi {this.props.user.first_name}
                </Link>
              ) : (
                <Link to="/sign-in" className="nav-link">
                  Account
                </Link>
              )}
            </Nav.Item>
            {this.props.signedIn && (
              <Nav.Item>
                <Link to="/cart" className="nav-link">
                  Cart
                </Link>
              </Nav.Item>
            )}
            {this.props.signedIn && (
              <Nav.Item>
                <Link to="/" className="nav-link" onClick={this.props.signOut}>
                  Sign out
                </Link>
              </Nav.Item>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

Navigation.propTypes = {
  signedIn: PropTypes.bool,
  user: PropTypes.object,
  signOut: PropTypes.func,
};

const mapStateToProps = (state) => ({
  signedIn: state.auth.signedIn,
  user: state.auth.user,
});

export default connect(mapStateToProps, { signOut })(Navigation);
