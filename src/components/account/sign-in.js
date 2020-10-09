import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

function SignIn() {
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
          <Form className="account-form">
            <h3 className="text-center mb-3">Sign in to your account</h3>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter password" />
            </Form.Group>
            <Form.Group controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Remember me" />
            </Form.Group>
            <Button type="submit" className="w-100 button-oval">
              Sign In
            </Button>
          </Form>
          <h6 className="mt-3 text-center">Don't have an account?</h6>
          <Row className="account-button-container">
            <Col className="text-center">
              <Link to="/sign-up">
                <Button className="w-100 button-oval button-orange">
                  Sign Up
                </Button>
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default SignIn;
