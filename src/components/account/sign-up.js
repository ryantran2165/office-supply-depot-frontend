import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { signUp } from "../../actions/auth-actions";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    };
  }

  handleOnSubmit = (e) => {
    e.preventDefault();

    const data = {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
    };

    this.props.signUp(data);
  };

  handleOnChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6}>
            <Row>
              <Col className="text-center mb-3">
                <Image
                  className="account-logo"
                  src="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"
                  alt="OSD logo"
                />
              </Col>
            </Row>
            <Form className="account-form" onSubmit={this.handleOnSubmit}>
              <h3 className="text-center mb-3">Create your account</h3>
              <Form.Group>
                <Form.Label>First name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="John"
                  name="firstName"
                  value={this.state.firstName}
                  onChange={this.handleOnChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Doe"
                  name="lastName"
                  value={this.state.lastName}
                  onChange={this.handleOnChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder="john.doe@gmail.com"
                  name="email"
                  value={this.state.email}
                  onChange={this.handleOnChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  placeholder="**********"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleOnChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Check type="checkbox" label="Remember me" />
              </Form.Group>
              <Button className="button-oval w-100" type="submit">
                Sign Up
              </Button>
            </Form>
            <h6 className="text-center mt-3">Already have an account?</h6>
            <Row className="account-button-container">
              <Col className="text-center">
                <Link to="/sign-in">
                  <Button className="button-oval button-orange w-100">
                    Sign In
                  </Button>
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

SignUp.propTypes = {
  signUp: PropTypes.func,
};

export default connect(null, { signUp })(SignUp);
