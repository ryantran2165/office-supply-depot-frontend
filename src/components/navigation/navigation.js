import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../actions/auth-actions";
import { setQuery } from "../../actions/products-actions";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import NavDropdown from "react-bootstrap/NavDropdown";
import { FaSearch } from "react-icons/fa";
import DropdownButton from "react-bootstrap/DropdownButton";

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
    };
  }

  handleOnChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleOnSubmit = (e) => {
    e.preventDefault();
    this.props.setQuery(this.state.query);
    this.props.history.push("/products");
  };

  render() {
    return (
      <Navbar bg="light" expand="md" className="pt-3">
        <Link to="/" className="navbar-brand">
          <img
            src="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"
            width="75"
            height="75"
            alt="OSD logo"
          />
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="mt-3 mt-md-0">
          <Nav id="search-nav" className="mx-md-auto">
            <Form inline className="w-100" onSubmit={this.handleOnSubmit}>
              {/*Dropdown for non-mobile only*/}
              <Dropdown className="d-none d-md-block">
                <Dropdown.Toggle id="search-dropdown" />
                <Dropdown.Menu>
                  <Dropdown.Item>Office Supplies</Dropdown.Item>
                  <Dropdown.Item>Furniture</Dropdown.Item>
                  <Dropdown.Item>Cleaning</Dropdown.Item>
                  <DropdownButton
                    title="Submenu"
                    drop="right"
                    className="submenu-button"
                  >
                    <Dropdown.Item>Submenu item 1</Dropdown.Item>
                    <Dropdown.Item>Submenu item 2</Dropdown.Item>
                    <Dropdown.Item>Submenu item 3</Dropdown.Item>
                  </DropdownButton>
                </Dropdown.Menu>
              </Dropdown>
              <FormControl
                type="text"
                placeholder="Search"
                id="search-box"
                value={this.state.query}
                name="query"
                onChange={this.handleOnChange}
              />
              <Button type="submit" id="search-button">
                <FaSearch />
              </Button>
            </Form>
            {/*Dropdown for mobile only*/}
            <NavDropdown title="Products" className="d-md-none">
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
  setQuery: PropTypes.func,
};

const mapStateToProps = (state) => ({
  signedIn: state.auth.signedIn,
  user: state.auth.user,
});

export default connect(mapStateToProps, { signOut, setQuery })(
  withRouter(Navigation)
);
