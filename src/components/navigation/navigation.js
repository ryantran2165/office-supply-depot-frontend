import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../actions/auth-actions";
import {
  setQuery,
  setCategory,
  setSubcategory,
} from "../../actions/products-actions";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import NavDropdown from "react-bootstrap/NavDropdown";
import { FaSearch } from "react-icons/fa";
import PRODUCT_CATEGORIES from "../product-categories";

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

    // Query resets category and subcategory
    this.props.setQuery(this.state.query);
    this.props.setCategory("");
    this.props.setSubcategory("");
    this.props.history.push("/products");
  };

  handleNavOnClick = (category, subcategory) => {
    // Nav clicks reset query, but inside products page filters don't reset query
    this.setState({ query: "" });
    this.props.setQuery("");
    this.props.setCategory(category);
    this.props.setSubcategory(subcategory);
    this.props.history.push("/products");
  };

  getNavDropdowns() {
    return Object.keys(PRODUCT_CATEGORIES).map((category) => {
      const subcategories = PRODUCT_CATEGORIES[category];

      // No subcategories
      if (subcategories.length === 0) {
        return (
          <NavDropdown.Item
            className="no-submenu-navdropdown-item"
            onClick={() => this.handleNavOnClick(category, "")}
            key={category}
          >
            {category}
          </NavDropdown.Item>
        );
      }

      // Has subcategories, dropdown
      return (
        <NavDropdown
          className="submenu"
          title={category}
          drop="right"
          key={category}
        >
          {subcategories.map((subcategory) => (
            <NavDropdown.Item
              onClick={() => this.handleNavOnClick(category, subcategory)}
              key={subcategory}
            >
              {subcategory}
            </NavDropdown.Item>
          ))}
        </NavDropdown>
      );
    });
  }

  render() {
    return (
      <Navbar className="pt-3 px-md-5" bg="light" expand="md">
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
          <Nav id="search-nav" className="mx-md-auto">
            <Form inline className="w-100" onSubmit={this.handleOnSubmit}>
              {/*Dropdown for non-mobile only*/}
              <Dropdown className="d-none d-md-block">
                <Dropdown.Toggle id="search-dropdown" />
                <Dropdown.Menu>{this.getNavDropdowns()}</Dropdown.Menu>
              </Dropdown>
              <FormControl
                type="text"
                placeholder="Search"
                id="search-box"
                name="query"
                value={this.state.query}
                onChange={this.handleOnChange}
              />
              <Button id="search-button" type="submit">
                <FaSearch />
              </Button>
            </Form>
            {/*Dropdown for mobile only*/}
            <NavDropdown className="d-md-none" title="Products">
              {this.getNavDropdowns()}
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Item>
              {this.props.signedIn && this.props.user !== null ? (
                <Link className="nav-link" to="/account">
                  Hi {this.props.user.first_name}
                </Link>
              ) : (
                <Link className="nav-link" to="/sign-in">
                  Account
                </Link>
              )}
            </Nav.Item>
            {this.props.signedIn && (
              <Nav.Item>
                <Link className="nav-link" to="/cart">
                  Cart
                </Link>
              </Nav.Item>
            )}
            {this.props.signedIn && (
              <Nav.Item>
                <Link className="nav-link" to="/" onClick={this.props.signOut}>
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
  setCategory: PropTypes.func,
  setSubcategory: PropTypes.func,
};

const mapStateToProps = (state) => ({
  signedIn: state.auth.signedIn,
  user: state.auth.user,
});

export default connect(mapStateToProps, {
  signOut,
  setQuery,
  setCategory,
  setSubcategory,
})(withRouter(Navigation));
