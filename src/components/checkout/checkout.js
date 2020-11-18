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
import { calculateSubtotal, addMonies } from "../money";
import {
  SHIPPING_METHODS,
  SUBTOTAL_THRESHOLD,
  WEIGHT_THRESHOLD,
} from "../shipping";

const TAX_RATE = 0.0725;

class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: null,
      firstName: "",
      lastName: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      shippingMethod: SHIPPING_METHODS.PICKUP.value,
      subtotal: 0,
      tax: 0,
      shippingCost: 0,
      submitted: false,
      validated: false,
    };
  }

  componentDidMount() {
    const header = {
      headers: {
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };
    axios
      .get(`${API_URL}/carts/`, header)
      .then((res) => {
        const cartData = res.data;

        // To indicate that cart is loaded but empty
        if (cartData.length === 0) {
          this.setState({ cart: [] });
        }

        // Resolve all products first
        const promises = [];

        for (const item of cartData) {
          // Add the promise to the list
          const promise = axios.get(`${API_URL}/products/${item.product}`);
          promises.push(promise);
        }

        Promise.all(promises).then((res) => {
          const products = res.map((promise) => promise.data);

          // Replace product id with actual product
          for (const product of products) {
            for (const item of cartData) {
              if (product.id === item.product) {
                item.product = product;
                break;
              }
            }
          }

          this.setState({ cart: cartData });
        });
      })
      .catch(() => this.tokenExpired());
  }

  tokenExpired() {
    this.props.signOut();
    alert("Your token expired.\nPlease sign in again to use checkout.");
  }

  handleOnChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleOnChangeShipping = (e) => {
    this.setState({ shippingMethod: e.target.value });
  };

  calculateWeight() {
    let weight = 0;
    for (const item of this.state.cart) {
      weight += item.quantity * item.product.weight;
    }
    return weight;
  }

  calculateTax(subtotal) {
    const tax = parseFloat(subtotal) * TAX_RATE;
    return tax.toFixed(2);
  }

  handleOnSubmit = (e, subtotal, shipping, tax) => {
    e.preventDefault();

    // Form validation
    if (e.currentTarget.checkValidity() === false) {
      this.setState({ validated: true });
      return;
    }

    // Prevent multiple submits
    if (this.state.submitted) {
      return;
    }
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
          // Get cart items to send as data
          const items = [];
          for (const item of this.state.cart) {
            const itemData = {
              product: item.product.id,
              quantity: item.quantity,
              price: item.product.price,
            };
            items.push(itemData);
          }

          // All quantities valid, attempt to place order
          const data = {
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            address_1: this.state.address1,
            address_2: this.state.address2,
            city: this.state.city,
            state: this.state.state,
            zip_code: this.state.zipCode,
            phone: this.state.phone,
            shipping_method: this.state.shippingMethod,
            subtotal: parseFloat(subtotal),
            tax: parseFloat(tax),
            shipping_cost: parseFloat(shipping),
            items: items,
          };

          axios
            .post(`${API_URL}/orders/`, data, header)
            .then(() => this.props.history.push("/account"))
            .catch(() => this.tokenExpired());
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
    const shipping = SHIPPING_METHODS[this.state.shippingMethod].price;
    const tax = this.calculateTax(subtotal);
    const total = addMonies([subtotal, tax, shipping]);

    return (
      <Container fluid className="py-5 px-md-5">
        <Form
          className="checkout-address-form"
          onSubmit={(e) => this.handleOnSubmit(e, subtotal, shipping, tax)}
          noValidate
          validated={this.state.validated}
        >
          <Row className="justify-content-center">
            <Col className="py-3 pr-lg-5" xs={12} lg={6} xl={5}>
              <h5>Shipping address</h5>
              <Form.Row>
                <Form.Group as={Col}>
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
                <Form.Group as={Col}>
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
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Street address</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="012 Main Street"
                    name="address1"
                    value={this.state.address1}
                    onChange={this.handleOnChange}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Apt, suite, etc. (optional)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Apt 0"
                    name="address2"
                    value={this.state.address2}
                    onChange={this.handleOnChange}
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="San Francisco"
                    name="city"
                    value={this.state.city}
                    onChange={this.handleOnChange}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="CA"
                    name="state"
                    value={this.state.state}
                    onChange={this.handleOnChange}
                    pattern="[A-Z]{2}"
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>ZIP code</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="12345"
                    name="zipCode"
                    value={this.state.zipCode}
                    onChange={this.handleOnChange}
                    pattern="\d{5}"
                  />
                </Form.Group>
              </Form.Row>
              <Form.Group>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="0123456789"
                  name="phone"
                  value={this.state.phone}
                  onChange={this.handleOnChange}
                  pattern="\d{10}"
                />
              </Form.Group>
              <hr />
              <h5>Shipping method</h5>
              <p>
                Weight: {weight.toFixed(1)} lb{weight !== 1 ? "s" : ""}
              </p>
              <Form.Group>
                <Form.Check
                  label={`Free ${SHIPPING_METHODS.PICKUP.text}`}
                  type="radio"
                  name="shipping"
                  value={SHIPPING_METHODS.PICKUP.value}
                  checked={
                    this.state.shippingMethod === SHIPPING_METHODS.PICKUP.value
                  }
                  onChange={this.handleOnChangeShipping}
                />
                <Form.Check
                  label={`Free ${SHIPPING_METHODS.FREE_SAME_DAY_DRONE.text} (weight < ${WEIGHT_THRESHOLD} lbs, subtotal > $${SUBTOTAL_THRESHOLD})`}
                  type="radio"
                  name="shipping"
                  disabled={
                    subtotal <= SUBTOTAL_THRESHOLD || weight >= WEIGHT_THRESHOLD
                  }
                  value={SHIPPING_METHODS.FREE_SAME_DAY_DRONE.value}
                  checked={
                    this.state.shippingMethod ===
                    SHIPPING_METHODS.FREE_SAME_DAY_DRONE.value
                  }
                  onChange={this.handleOnChangeShipping}
                />
                <Form.Check
                  label={`$${
                    SHIPPING_METHODS.COST_SAME_DAY_DRONE.price.split(".")[0]
                  } ${
                    SHIPPING_METHODS.COST_SAME_DAY_DRONE.text
                  } (weight < ${WEIGHT_THRESHOLD} lbs, subtotal <= $${SUBTOTAL_THRESHOLD})`}
                  type="radio"
                  name="shipping"
                  disabled={
                    subtotal > SUBTOTAL_THRESHOLD || weight >= WEIGHT_THRESHOLD
                  }
                  value={SHIPPING_METHODS.COST_SAME_DAY_DRONE.value}
                  checked={
                    this.state.shippingMethod ===
                    SHIPPING_METHODS.COST_SAME_DAY_DRONE.value
                  }
                  onChange={this.handleOnChangeShipping}
                />
                <Form.Check
                  label={`Free ${SHIPPING_METHODS.FREE_TWO_DAY_TRUCK.text} (weight >= ${WEIGHT_THRESHOLD} lbs, subtotal > $${SUBTOTAL_THRESHOLD})`}
                  type="radio"
                  name="shipping"
                  disabled={
                    subtotal <= SUBTOTAL_THRESHOLD || weight < WEIGHT_THRESHOLD
                  }
                  value={SHIPPING_METHODS.FREE_TWO_DAY_TRUCK.value}
                  checked={
                    this.state.shippingMethod ===
                    SHIPPING_METHODS.FREE_TWO_DAY_TRUCK.value
                  }
                  onChange={this.handleOnChangeShipping}
                />
                <Form.Check
                  label={`$${
                    SHIPPING_METHODS.COST_SAME_DAY_TRUCK.price.split(".")[0]
                  } ${
                    SHIPPING_METHODS.COST_SAME_DAY_TRUCK.text
                  } (weight >= ${WEIGHT_THRESHOLD} lbs, subtotal > $${SUBTOTAL_THRESHOLD})`}
                  type="radio"
                  name="shipping"
                  disabled={
                    subtotal <= SUBTOTAL_THRESHOLD || weight < WEIGHT_THRESHOLD
                  }
                  value={SHIPPING_METHODS.COST_SAME_DAY_TRUCK.value}
                  checked={
                    this.state.shippingMethod ===
                    SHIPPING_METHODS.COST_SAME_DAY_TRUCK.value
                  }
                  onChange={this.handleOnChangeShipping}
                />
                <Form.Check
                  label={`$${
                    SHIPPING_METHODS.COST_TWO_DAY_TRUCK.price.split(".")[0]
                  } ${
                    SHIPPING_METHODS.COST_TWO_DAY_TRUCK.text
                  } (weight >= ${WEIGHT_THRESHOLD} lbs, subtotal <= $${SUBTOTAL_THRESHOLD})`}
                  type="radio"
                  name="shipping"
                  disabled={
                    subtotal > SUBTOTAL_THRESHOLD || weight < WEIGHT_THRESHOLD
                  }
                  value={SHIPPING_METHODS.COST_TWO_DAY_TRUCK.value}
                  checked={
                    this.state.shippingMethod ===
                    SHIPPING_METHODS.COST_TWO_DAY_TRUCK.value
                  }
                  onChange={this.handleOnChangeShipping}
                />
              </Form.Group>
              <hr />
              <h5>Credit card</h5>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Card number</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="0123456789012345"
                    pattern="\d{16}"
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Name on card</Form.Label>
                  <Form.Control required type="text" placeholder="John Doe" />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Expiration date (MM/YY)</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="01/20"
                    pattern="\d{2}/\d{2}"
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Security code</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="012"
                    pattern="\d{3,4}"
                  />
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
                  <Row key={`checkout-${item.id}`}>
                    <Col className="mb-3">
                      <Link to={`/products/${item.product.id}`}>
                        <div className="item-container">
                          <Image
                            rounded
                            className="square-image-fixed shadow"
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
