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
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      message: "",
      showSpinner: false,
    };
  }

  handleOnSubmit = (e) => {
    e.preventDefault();
    this.setState({ message: "", showSpinner: true });

    const data = {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
    };

    const promise = this.props.signUp(data);
    promise.then((res) => {
      this.setState({ showSpinner: false });

      if (res === true) {
        return;
      } else if (res.response) {
        this.setState({
          message: "Account with email already exists",
        });
      } else if (res.message) {
        this.setState({
          message: "There is a connection issue",
        });
      }
    });
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
                <Link to="/">
                  <Image
                    className="account-logo"
                    src="https://res.cloudinary.com/osd/image/upload/v1605931936/Office%20Supply%20Depot/office-supply-depot-logo_fnoqsd.png"
                    alt="OSD logo"
                  />
                </Link>
              </Col>
            </Row>
            <Form className="account-form" onSubmit={this.handleOnSubmit}>
              <h3 className="text-center mb-3">Create your account</h3>
              {this.state.showSpinner && (
                <div className="text-center">
                  <Spinner
                    animation="border"
                    variant="primary"
                    role="signing-up-status"
                  >
                    <span className="sr-only">Signing up...</span>
                  </Spinner>
                </div>
              )}
              {this.state.message !== "" && (
                <Alert variant="danger">{this.state.message}</Alert>
              )}
              <Form.Group>
                <Form.Label>First name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="John"
                  name="firstName"
                  value={this.state.firstName}
                  onChange={this.handleOnChange}
                  maxLength="128"
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
                  maxLength="128"
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
                  maxLength="254"
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
                  maxLength="128"
                />
              </Form.Group>
              <Button className="button-oval w-100" type="submit">
                Sign Up
              </Button>
            </Form>
            <h6 className="text-center mt-3">Already have an account?</h6>
            <Row className="account-button-container">
              <Col className="text-center">
                <Link to="/signin">
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

Signup.propTypes = {
  signUp: PropTypes.func,
};

export default connect(null, { signUp })(Signup);
