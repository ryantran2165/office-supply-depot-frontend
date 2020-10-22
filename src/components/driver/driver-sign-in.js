import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { driverSignIn } from "../../actions/auth-actions";
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
      <Container className="pt-5 pb-5">
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6}>
            <Row>
              <Col className="text-center mb-3">
                <Image
                  src="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"
                  className="account-logo"
                  alt="OSD logo"
                />
              </Col>
            </Row>
            <Form className="account-form" onSubmit={this.handleOnSubmit}>
              <h3 className="text-center mb-3">Sign in to your account</h3>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder="john.doe@gmail.com"
                  value={this.state.email}
                  name="email"
                  onChange={this.handleOnChange}
                />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  placeholder="**********"
                  value={this.state.password}
                  name="password"
                  onChange={this.handleOnChange}
                />
              </Form.Group>
              <Form.Group controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Remember me" />
              </Form.Group>
              <Button type="submit" className="w-100 button-oval">
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
