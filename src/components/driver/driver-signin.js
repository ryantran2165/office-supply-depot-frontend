import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { driverSignIn } from "../../actions/auth-actions";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class DriverSignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  handleOnSubmit = (e) => {
    e.preventDefault();

    const data = {
      email: this.state.email,
      password: this.state.password,
    };

    this.props.driverSignIn(data);
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
                    src="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"
                    alt="OSD logo"
                  />
                </Link>
              </Col>
            </Row>
            <Form className="account-form" onSubmit={this.handleOnSubmit}>
              <h3 className="text-center mb-3">Sign in to your account</h3>
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
                Sign In
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

DriverSignIn.propTypes = {
  driverSignIn: PropTypes.func,
};

export default connect(null, { driverSignIn })(DriverSignIn);
