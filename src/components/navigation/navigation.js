import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { signOut } from "../../actions/auth-actions";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import RestrictedRoute from "../restricted-route";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import NavDropdown from "react-bootstrap/NavDropdown";
import { FaSearch } from "react-icons/fa";
import Home from "../home/home";
import SignIn from "../account/sign-in";
import SignUp from "../account/sign-up";
import Account from "../account/account";
import Cart from "../cart/cart";

class Navigation extends Component {
  render() {
    return (
      <BrowserRouter>
        <Navbar bg="light" expand="md" className="justify-content-center pt-3">
          <Link to="/" className="navbar-brand">
            Office Supply Depot
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
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
                  <Link
                    to="/"
                    className="nav-link"
                    onClick={this.props.signOut}
                  >
                    Sign out
                  </Link>
                </Nav.Item>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Switch>
          <RestrictedRoute
            path="/sign-in"
            component={SignIn}
            allowSignedIn={false}
            redirect="/account"
          />
          <RestrictedRoute
            path="/sign-up"
            component={SignUp}
            allowSignedIn={false}
            redirect="/account"
          />
          <RestrictedRoute
            path="/account"
            component={Account}
            allowSignedIn={true}
            redirect="/sign-in"
          />
          <RestrictedRoute
            path="/cart"
            component={Cart}
            allowSignedIn={true}
            redirect="/sign-in"
          />
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </BrowserRouter>
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
