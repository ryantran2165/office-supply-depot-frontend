import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../actions/auth-actions";
import axios from "axios";
import { API_URL } from "../../App";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card"
import { FormControl, FormGroup, FormLabel } from "react-bootstrap";

class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: null,
      payment_type: null,
    };
  }

  componentDidMount() {
    this.loadCart();
  }

  loadCart() {
    const header = {
      headers: {
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };
    axios
      .get(`${API_URL}/carts/`, header)
      .then((res) => {
        const cart = [];

        // To indicate that cart is loaded but empty
        if (res.data.length === 0) {
          this.setState({ cart });
        }

        // Replace product ids with actual products and add one at a time
        for (let item of res.data) {
          axios.get(`${API_URL}/products/${item.product}`).then((res) => {
            item.product = res.data;
            cart.push(item);
            this.setState({ cart: [...cart] });
          });
        }
      })
      .catch(() => {
        this.tokenExpired();
      });
  }

  tokenExpired() {
    this.props.signOut();
    alert("Your token expired.\nPlease sign in again to use checkout.");
  }

  handleOnChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    // Make sure cart is not null before rendering
    if (this.state.cart === null) {
      return "";
    }

    // Empty cart, go back to cart
    if (this.state.cart.length === 0) {
      this.props.history.push("/cart");
    }

    const {payment_type} = this.state;
    return (
      
      <Container fluid className="d-flex px-md-5 py-3">
        <Col xs={7}>
          <Row className="checkout-padding-left">
            <h5>Shipping address</h5>
          </Row>
          <Row className="justify-content-end pr-5">
            <Form className="shipping-form">
                <Form.Row>
                  <FormGroup as={Col}>
                    <FormLabel className="grey-text">First name</FormLabel>
                    <Form.Control
                      required
                      type="text"
                      name="first_name"
                    />
                  </FormGroup>
                  <FormGroup as={Col}>
                    <FormLabel className="grey-text">Last name</FormLabel>
                    <Form.Control
                      required
                      type="text"
                      name="last_name"
                    />
                  </FormGroup>
                </Form.Row>
                <Form.Row>
                  <FormGroup as={Col}>
                    <FormLabel className="grey-text">Street name</FormLabel>
                    <Form.Control
                      required
                      type="text"
                      name="street_name"
                    />
                  </FormGroup>
                  <FormGroup as={Col}>
                    <FormLabel className="grey-text">Apt, suite, etc (optional)</FormLabel>
                    <Form.Control
                      type="text"
                      name="apt_number"
                    />
                  </FormGroup>
                </Form.Row>
                
                <Form.Row>
                  <FormGroup as={Col}>
                    <FormLabel className="grey-text">City</FormLabel>
                    <Form.Control
                      required
                      type="text"
                      name="city"
                    />
                  </FormGroup>
                  <FormGroup as={Col}>
                    <FormLabel className="grey-text">State</FormLabel>
                    <Form.Control
                      required
                      type="text"
                      name="state"
                    />
                  </FormGroup>
                  <FormGroup as={Col}>
                    <FormLabel className="grey-text">ZIP code</FormLabel>
                    <Form.Control
                      required
                      type="text"
                      name="zip_code"
                    />
                  </FormGroup>
                </Form.Row>
                <FormGroup>
                  <FormLabel className="grey-text">Phone number</FormLabel>
                  <Form.Control
                    required
                    type="text"
                    name="phone_number"
                  />
                </FormGroup>
                <Button className="button-oval px-4" type="submit">Save</Button>
            </Form>
          </Row>
          <Row className="checkout-padding-left pb-3">
            <h5>Shipping method</h5>
          </Row>
          <Row className="checkout-padding-left ml-3">
            <fieldset>
              <FormGroup as={Col}>
                <Form.Check
                  className="pb-3"
                  type="radio"
                  label="Free Pickup"
                  name="pickup"
                />
                <Form.Check
                  type="radio"
                  label="Delivery"
                  name="delivery"
                />
              </FormGroup>
            </fieldset>
          </Row>
          <Row className="checkout-padding-left py-3">
            <h5>Payment method</h5>
          </Row>
          <Row className="checkout-padding-left pb-3">
            <Button className="p-2" onClick={() => this.setState({ payment_type: "credit" })}>Credit card</Button>
            <Button className="ml-3 px-3 py-2" onClick={() => this.setState({ payment_type: "paypal" })}>Paypal</Button>
          </Row>
          <Row className="checkout-padding-left" style={{ display: (payment_type == "credit" ? 'block' : 'none') }}>
            <Form className="payment-form credit-form">
            <FormGroup>
            <Form.Control 
                required
                type="text"
                name="card_number"
                placeholder="Card number"
              />
            </FormGroup>
            <FormGroup>
            <Form.Control
                    required
                    type="text"
                    name="name_on_card"
                    placeholder="Name on card"
                  />
            </FormGroup>
            <Form.Row>
                <FormGroup as={Col}>
                  <Form.Control
                    required
                    type="text"
                    name="exp_date"
                    placeholder="Expiration date (MM/YY)"
                  />
                </FormGroup>
                <FormGroup as={Col}>
                  <Form.Control
                    required
                    type="text"
                    name="security_code"
                    placeholder="Security code"
                  />
                </FormGroup>
              </Form.Row>
            </Form>
          </Row>
          <Row className="checkout-padding-left" style={{ display: (payment_type == "paypal" ? 'block' : 'none') }}>
            <Card className="payment-form paypal-form py-5">
              <Card.Body>
                <Card.Text>After you complete your order, you will be directed to Paypal to securely proceed you payment.</Card.Text>
              </Card.Body>
            </Card>
          </Row>
        </Col>
        <Col className = "vertical-divider py-3">
          <Container className="checkout-padding-right">
            <Row className="pl-5">
              <Col xs={8}>
                <Image rounded fluid className="checkout-img" src="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"></Image>
                <span className="item-quantity">1</span>
              </Col>
              <Col className="checkout-padding-right">$$$</Col>
            </Row>
            <Row>
              <hr className="hr-width"></hr>
            </Row>
            
            <Row className="pl-5">
              <Col xs={8}>
                <Row className="pb-1">
                  <Col>Subtotal</Col>
                </Row>
                <Row className="pb-1">
                  <Col>Delivery</Col>
                </Row>
                <Row>
                  <Col>Taxes</Col>
                </Row>
              </Col>
              <Col>
                <Row className="pb-1">
                  <Col>$$$</Col>
                </Row>
                <Row className="pb-1">
                  <Col>$$$</Col>
                </Row>
                <Row>
                  <Col>$$$</Col>
                </Row>
                
              </Col>
            </Row>
            <Row>
              <hr className="hr-width"></hr>
            </Row>
            <Row className="pl-5 pb-3">
              <Col xs={8}>
                <h5>Total</h5>
              </Col>
              <Col>
                <h5>$$$</h5>
              </Col>
            </Row>
            <Row className="justify-content-center pr-5">
              <Button className="button-oval w-50">Place order</Button>
            </Row>
          </Container>
          
        </Col>
      </Container>
    );
  }
}

export default connect(null, { signOut })(withRouter(Checkout));
