import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { FaSearch } from "react-icons/fa";
import Home from "../home/home";
import SignIn from "../account/sign-in";
import SignUp from "../account/sign-up";
import Cart from "../cart/cart";
import Account from "../account/account";

function Navigation({
  signedIn,
  user,
  handleSignIn,
  handleSignUp,
  handleSignOut,
}) {
  let accountLink;

  // Test for undefined because it loads twice and the first load has undefined user
  if (signedIn && user !== undefined) {
    accountLink = (
      <Link to="/account" className="nav-link">
        Hi {user.first_name}
      </Link>
    );
  } else {
    accountLink = (
      <Link to="/sign-in" className="nav-link">
        Account
      </Link>
    );
  }

  return (
    <Router>
      <Navbar bg="light" expand="lg" className="justify-content-center pt-3">
        <Link to="/" className="navbar-brand">
          Office Supply Depot
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Dropdown as={ButtonGroup}>
              <Dropdown.Toggle id="search-dropdown" />
              <Dropdown.Menu>
                <Dropdown.Item>Office Supplies</Dropdown.Item>
                <Dropdown.Item>Furniture</Dropdown.Item>
                <Dropdown.Item>Cleaning</Dropdown.Item>
              </Dropdown.Menu>
              <Form inline>
                <FormControl type="text" placeholder="Search" id="search-box" />
                <Button id="search-button">
                  <FaSearch />
                </Button>
              </Form>
            </Dropdown>
          </Nav>
          <Nav>
            <Nav.Item>{accountLink}</Nav.Item>
            <Nav.Item>
              <Link to="/cart" className="nav-link">
                Cart
              </Link>
            </Nav.Item>
            {signedIn && (
              <Nav.Item>
                <Link to="/" className="nav-link" onClick={handleSignOut}>
                  Sign out
                </Link>
              </Nav.Item>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Switch>
        <Route path="/sign-in">
          <SignIn signedIn={signedIn} handleSignIn={handleSignIn} />
        </Route>
        <Route path="/sign-up">
          <SignUp signedIn={signedIn} handleSignUp={handleSignUp} />
        </Route>
        <Route path="/cart">
          <Cart />
        </Route>
        <Route path="/account">
          <Account />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default Navigation;
