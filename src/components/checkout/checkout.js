import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
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
import { calculateSubtotal } from "../cart/cart";

const TAX_RATE = 0.0725;
const SUBTOTAL_THRESHOLD = 100;
const WEIGHT_THRESHOLD = 15;
const SAME_DAY_DRONE_COST = 20;
const TWO_DAY_TRUCK_COST = 20;
const SAME_DAY_TRUCK_COST = 25;
const PICKUP_VALUE = 0;
const FREE_SAME_DAY_DRONE_VALUE = 1;
const COST_SAME_DAY_DRONE_VALUE = 2;
const FREE_TWO_DAY_TRUCK_VALUE = 3;
const COST_SAME_DAY_TRUCK_VALUE = 4;
const COST_TWO_DAY_TRUCK_VALUE = 5;

class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: null,
      shippingMethod: 0,
      submitted: false,
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

  handleOnChangeShipping = (e) => {
    this.setState({ shippingMethod: parseInt(e.target.value) });
  };

  calculateWeight() {
    let weight = 0;
    for (let item of this.state.cart) {
      weight += item.quantity * item.product.weight;
    }
    return weight;
  }

  calculateTax(subtotal) {
    const tax = parseFloat(subtotal) * TAX_RATE;
    return tax.toFixed(2);
  }

  calculateShipping() {
    switch (this.state.shippingMethod) {
      case COST_SAME_DAY_DRONE_VALUE:
        return `${SAME_DAY_DRONE_COST}.00`;
      case COST_SAME_DAY_TRUCK_VALUE:
        return `${SAME_DAY_TRUCK_COST}.00`;
      case COST_TWO_DAY_TRUCK_VALUE:
        return `${TWO_DAY_TRUCK_COST}.00`;
      default:
        return "0.00";
    }
  }

  calculateTotal(...monies) {
    let totalDollars = 0;
    let totalCents = 0;
    for (let money of monies) {
      const [dollars, cents] = money.split(".");
      totalDollars += parseInt(dollars);
      totalCents += parseInt(cents);
    }
    const dollarsFromCents = Math.floor(totalCents / 100);
    const remainingCents = totalCents % 100;
    totalDollars += dollarsFromCents;
    return `${totalDollars}.${remainingCents < 10 ? "0" : ""}${remainingCents}`;
  }

  handleOnSubmit = (e) => {
    // Prevent multiple submits
    if (this.state.submitted) {
      return;
    }
    e.preventDefault();
    this.setState({ submitted: true });

    const header = {
      headers: {
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };

    // Check all quantities are <= the available stock
    for (let i = 0; i < this.state.cart.length; i++) {
      const item = this.state.cart[i];

      axios.get(`${API_URL}/products/${item.product.id}`).then((res) => {
        // Not enough inventory
        if (item.quantity > res.data.inventory) {
          this.props.history.push("/cart");
          alert(
            "Some products' inventories have changed.\nPlease reduce quantities that are greater than the available stock or remove the product."
          );
          return;
        } else if (i === this.state.cart.length - 1) {
          // All quantities valid, attempt to place order
          const data = {};

          axios
            .post(`${API_URL}/orders/`, data, header)
            .then((res) => {
              this.props.history.push("/account");
            })
            .catch((err) => {
              this.tokenExpired();
            });
        }
      });
    }
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

    const weight = this.calculateWeight();
    const subtotal = calculateSubtotal(this.state.cart);
    const shipping = this.calculateShipping();
    const tax = this.calculateTax(subtotal);
    const total = this.calculateTotal(subtotal, tax, shipping);

    return (
      <Container fluid className="py-5 px-md-5">
        <Form className="checkout-address-form" onSubmit={this.handleOnSubmit}>
          <Row className="justify-content-center">
            <Col className="py-3 pr-lg-5" xs={12} lg={6} xl={5}>
              <h5>Shipping address</h5>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>First name</Form.Label>
                  <Form.Control required type="text" name="first_name" />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Last name</Form.Label>
                  <Form.Control required type="text" name="last_name" />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Street name</Form.Label>
                  <Form.Control required type="text" name="street_name" />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Apt, suite, etc (optional)</Form.Label>
                  <Form.Control type="text" name="apt_number" />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>City</Form.Label>
                  <Form.Control required type="text" name="city" />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>State</Form.Label>
                  <Form.Control required type="text" name="state" />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>ZIP code</Form.Label>
                  <Form.Control required type="text" name="zip_code" />
                </Form.Group>
              </Form.Row>
              <Form.Group>
                <Form.Label>Phone number</Form.Label>
                <Form.Control required type="text" name="phone_number" />
              </Form.Group>
              <hr />
              <h5>Shipping method</h5>
              <p>
                Weight: {weight.toFixed(1)} lb{weight !== 1 ? "s" : ""}
              </p>
              <Form.Group>
                <Form.Check
                  label="Pickup"
                  type="radio"
                  name="shipping"
                  value={PICKUP_VALUE}
                  checked={this.state.shippingMethod === PICKUP_VALUE}
                  onChange={this.handleOnChangeShipping}
                />
                <Form.Check
                  label={`Free same-day drone (weight < ${WEIGHT_THRESHOLD} lbs, subtotal > $${SUBTOTAL_THRESHOLD})`}
                  type="radio"
                  name="shipping"
                  disabled={
                    subtotal <= SUBTOTAL_THRESHOLD || weight >= WEIGHT_THRESHOLD
                  }
                  value={FREE_SAME_DAY_DRONE_VALUE}
                  checked={
                    this.state.shippingMethod === FREE_SAME_DAY_DRONE_VALUE
                  }
                  onChange={this.handleOnChangeShipping}
                />
                <Form.Check
                  label={`$${SAME_DAY_DRONE_COST} same-day drone (weight < ${WEIGHT_THRESHOLD} lbs, subtotal <= $${SUBTOTAL_THRESHOLD})`}
                  type="radio"
                  name="shipping"
                  disabled={
                    subtotal > SUBTOTAL_THRESHOLD || weight >= WEIGHT_THRESHOLD
                  }
                  value={COST_SAME_DAY_DRONE_VALUE}
                  checked={
                    this.state.shippingMethod === COST_SAME_DAY_DRONE_VALUE
                  }
                  onChange={this.handleOnChangeShipping}
                />
                <Form.Check
                  label={`Free 2-day truck (weight >= ${WEIGHT_THRESHOLD} lbs, subtotal > $${SUBTOTAL_THRESHOLD})`}
                  type="radio"
                  name="shipping"
                  disabled={
                    subtotal <= SUBTOTAL_THRESHOLD || weight < WEIGHT_THRESHOLD
                  }
                  value={FREE_TWO_DAY_TRUCK_VALUE}
                  checked={
                    this.state.shippingMethod === FREE_TWO_DAY_TRUCK_VALUE
                  }
                  onChange={this.handleOnChangeShipping}
                />
                <Form.Check
                  label={`$${SAME_DAY_TRUCK_COST} same-day truck (weight >= ${WEIGHT_THRESHOLD} lbs, subtotal > $${SUBTOTAL_THRESHOLD})`}
                  type="radio"
                  name="shipping"
                  disabled={
                    subtotal <= SUBTOTAL_THRESHOLD || weight < WEIGHT_THRESHOLD
                  }
                  value={COST_SAME_DAY_TRUCK_VALUE}
                  checked={
                    this.state.shippingMethod === COST_SAME_DAY_TRUCK_VALUE
                  }
                  onChange={this.handleOnChangeShipping}
                />
                <Form.Check
                  label={`$${TWO_DAY_TRUCK_COST} 2-day truck (weight >= ${WEIGHT_THRESHOLD} lbs, subtotal <= $${SUBTOTAL_THRESHOLD})`}
                  type="radio"
                  name="shipping"
                  disabled={
                    subtotal > SUBTOTAL_THRESHOLD || weight < WEIGHT_THRESHOLD
                  }
                  value={COST_TWO_DAY_TRUCK_VALUE}
                  checked={
                    this.state.shippingMethod === COST_TWO_DAY_TRUCK_VALUE
                  }
                  onChange={this.handleOnChangeShipping}
                />
              </Form.Group>
              <hr />
              <h5>Credit card</h5>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Card number</Form.Label>
                  <Form.Control required type="text" name="card_number" />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Name on card</Form.Label>
                  <Form.Control required type="text" name="name_on_card" />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Expiration date (MM/YY)</Form.Label>
                  <Form.Control required type="text" name="expiration_date" />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Security code</Form.Label>
                  <Form.Control required type="text" name="security_code" />
                </Form.Group>
              </Form.Row>
            </Col>
            <Col
              className="left-vertical-divider py-3 pl-lg-5"
              xs={12}
              lg={6}
              xl={5}
            >
              <hr className="hr-md" />
              {this.state.cart.map((item) => {
                return (
                  <Row key={item.id}>
                    <Col className="mb-3">
                      <Link to={`/products/${item.product.id}`}>
                        <div className="item-container">
                          <Image
                            rounded
                            className="square-img shadow"
                            src={item.product.img_url}
                          />
                          <span className="item-quantity">{item.quantity}</span>
                        </div>
                      </Link>
                    </Col>
                    <Col>
                      <h5>${calculateSubtotal([item])}</h5>
                    </Col>
                  </Row>
                );
              })}
              <hr />
              <Row className="mb-3">
                <Col>
                  <h5>Subtotal ({this.state.cart.length})</h5>
                </Col>
                <Col>
                  <h5>${subtotal}</h5>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <h5>Tax (7.25%)</h5>
                </Col>
                <Col>
                  <h5>${tax}</h5>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <h5>Shipping</h5>
                </Col>
                <Col>
                  <h5>${shipping}</h5>
                </Col>
              </Row>
              <hr />
              <Row className="mb-3">
                <Col>
                  <h5>Total</h5>
                </Col>
                <Col>
                  <h5>${total}</h5>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button className="button-oval w-100" type="submit">
                    Place order
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Container>
    );
  }
}

export default connect(null, { signOut })(withRouter(Checkout));
