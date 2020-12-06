import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../actions/auth-actions";
import axios from "axios";
import { API_URL, getAuthHeader } from "../../App";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { Loader } from "@googlemaps/js-api-loader";
import {
  calculateItemSubweight,
  addWeights,
  calculateItemSubtotal,
  addPrices,
} from "../calculations";
import {
  SHIPPING_METHODS,
  SUBTOTAL_THRESHOLD,
  WEIGHT_THRESHOLD,
} from "../shipping";
import { GOOGLE_MAPS_API_KEY } from "../../App";

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
      shippingMethod: SHIPPING_METHODS.PICKUP_1.value,
      subtotal: 0,
      tax: 0,
      shippingCost: 0,
      submitted: false,
      validated: false,
      error: "",
      warning: "",
      address1Alt: "",
      cityAlt: "",
      stateAlt: "",
      zipCodeAlt: "",
    };

    // Geocoder
    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
    });

    loader.load().then(() => {
      this.geocoder = new window.google.maps.Geocoder();
    });
  }

  componentDidMount() {
    axios
      .get(`${API_URL}/carts/`, getAuthHeader())
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

          cartData.sort((a, b) => a.product.name.localeCompare(b.product.name));
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

  calculateTax(subtotal) {
    const tax = parseFloat(subtotal) * TAX_RATE;
    return tax.toFixed(2);
  }

  validateExpirationDate(e) {
    const date = e.target.value.split("/");
    const month = parseInt(date[0]);
    const year = parseInt(date[1]);

    // Invalid month
    if (month < 1 || month > 12) {
      e.target.setCustomValidity("Invalid month!");
      return;
    }

    const curDate = new Date().toLocaleDateString().split("/");
    const curMonth = parseInt(curDate[0]);
    const curYear = parseInt(curDate[2].substring(2, 4));

    // Expired
    if (year < curYear || (year === curYear && month < curMonth)) {
      e.target.setCustomValidity("Expired!");
      return;
    }

    e.target.setCustomValidity("");
  }

  handleOnSubmit = (e, weight, subtotal, shipping, tax) => {
    // Prevent multiple submits
    if (this.state.submitted) {
      return;
    }

    e.preventDefault();
    this.setState({ error: "", warning: "" });

    // Form validation
    if (e.currentTarget.checkValidity() === false) {
      this.setState({ validated: true });
      return;
    }

    // Address validation
    const address = `${this.state.address1}, ${this.state.city}, ${this.state.state} ${this.state.zipCode}`;

    this.geocoder.geocode({ address: address }, (results, status) => {
      if (status === "ZERO_RESULTS") {
        this.setState({ error: "Invalid address" });
        return;
      } else if (status !== "OK") {
        this.setState({ error: "Geocoder ran into an error" });
        return;
      }

      // Check if formatted address matches user input exactly
      try {
        const formattedAddress = results[0].formatted_address;
        const split1 = formattedAddress.split(",");
        const address1 = split1[0];
        const city = split1[1].substring(1, split1[1].length);
        const split2 = split1[2].split(" ");
        const state = split2[1];
        const zipCode = split2[2];

        // Weird addresses
        if (
          address1 === undefined ||
          city === undefined ||
          state === undefined ||
          zipCode === undefined
        ) {
          this.setState({ error: "Invalid address" });
          return;
        }

        // Not match
        if (
          address1 !== this.state.address1 ||
          city !== this.state.city ||
          state !== this.state.state ||
          zipCode !== this.state.zipCode
        ) {
          this.setState({
            warning: `Did you mean: ${address1}, ${city}, ${state} ${zipCode}`,
            address1Alt: address1,
            cityAlt: city,
            stateAlt: state,
            zipCodeAlt: zipCode,
          });
          return;
        }
      } catch (err) {
        this.setState({ error: "Invalid address" });
        return;
      }

      this.setState({ submitted: true });
      const promises = [];

      // Check all quantities are <= the available stock
      for (const item of this.state.cart) {
        const promise = axios.get(`${API_URL}/products/${item.product.id}`);
        promises.push(promise);
      }

      Promise.all(promises).then((res) => {
        const products = res.map((promise) => promise.data);

        for (const product of products) {
          for (const item of this.state.cart) {
            if (product.id === item.product.id) {
              // Not enough inventory
              if (item.quantity > product.inventory) {
                this.props.history.push("/cart");
                alert(
                  "Some products' inventories have changed.\nPlease reduce quantities that are greater than the available stock or remove the product."
                );
                return;
              }
            }
          }
        }

        // All quantities valid, get cart items to send as data
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
          weight: parseFloat(weight),
          subtotal: parseFloat(subtotal),
          tax: parseFloat(tax),
          shipping_cost: parseFloat(shipping),
          items: items,
        };

        const promises2 = [];

        // Post new order
        const postOrderPromise = axios.post(
          `${API_URL}/orders/`,
          data,
          getAuthHeader()
        );
        promises2.push(postOrderPromise);

        for (const item of this.state.cart) {
          // Patch product inventories
          const productData = {
            inventory: item.product.inventory - item.quantity,
          };
          const patchProductPromise = axios.patch(
            `${API_URL}/products/${item.product.id}/`,
            productData,
            getAuthHeader()
          );
          promises2.push(patchProductPromise);

          // Clear cart
          const deleteCartPromise = axios.delete(
            `${API_URL}/carts/${item.id}/`,
            getAuthHeader()
          );
          promises2.push(deleteCartPromise);
        }

        Promise.all(promises2)
          .then(() => this.props.history.push("/account"))
          .catch(() => this.tokenExpired());
      });
    });
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

    const weight = addWeights(
      this.state.cart.map((item) =>
        calculateItemSubweight(item.product.weight, item.quantity)
      )
    );
    const subtotal = addPrices(
      this.state.cart.map((item) =>
        calculateItemSubtotal(item.product.price, item.quantity)
      )
    );
    const shipping = SHIPPING_METHODS[this.state.shippingMethod].price;
    const tax = this.calculateTax(subtotal);
    const total = addPrices([subtotal, tax, shipping]);

    return (
      <Container fluid className="py-5 px-md-5">
        <Form
          className="checkout-address-form"
          onSubmit={(e) =>
            this.handleOnSubmit(e, weight, subtotal, shipping, tax)
          }
          noValidate
          validated={this.state.validated}
        >
          <Row className="justify-content-center">
            <Col className="py-3 pr-lg-5" xs={12} lg={6} xl={5}>
              {this.state.error !== "" && (
                <Alert variant="danger">{this.state.error}</Alert>
              )}
              {this.state.warning !== "" && (
                <React.Fragment>
                  <Alert variant="warning">{this.state.warning}</Alert>
                  <Button
                    className="mb-3 mr-3"
                    onClick={() =>
                      this.setState({
                        warning: "",
                        address1: this.state.address1Alt,
                        city: this.state.cityAlt,
                        state: this.state.stateAlt,
                        zipCode: this.state.zipCodeAlt,
                      })
                    }
                  >
                    Yes
                  </Button>
                  <Button
                    className="mb-3"
                    onClick={() => this.setState({ warning: "" })}
                  >
                    No
                  </Button>
                </React.Fragment>
              )}
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
                    pattern="^[a-zA-Z][a-zA-Z ,.'-]*$"
                    maxLength="128"
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
                    pattern="^[a-zA-Z][a-zA-Z ,.'-]*$"
                    maxLength="128"
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
                    maxLength="128"
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
                    maxLength="128"
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
                    maxLength="128"
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
                    pattern="^(?:A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|PA|RI|S[CD]|T[NX]|UT|V[AT]|W[AIVY])*$"
                    maxLength="2"
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
                    pattern="^\d{5}$"
                    maxLength="5"
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
                  pattern="^\d{10}$"
                  maxLength="10"
                />
              </Form.Group>
              <hr />
              <h5>Shipping method</h5>
              <Form.Group>
                <Form.Check
                  label={`Free ${SHIPPING_METHODS.PICKUP_1.text}`}
                  type="radio"
                  name="shipping"
                  value={SHIPPING_METHODS.PICKUP_1.value}
                  checked={
                    this.state.shippingMethod ===
                    SHIPPING_METHODS.PICKUP_1.value
                  }
                  onChange={this.handleOnChangeShipping}
                />
                <Form.Check
                  label={`Free ${SHIPPING_METHODS.PICKUP_2.text}`}
                  type="radio"
                  name="shipping"
                  value={SHIPPING_METHODS.PICKUP_2.value}
                  checked={
                    this.state.shippingMethod ===
                    SHIPPING_METHODS.PICKUP_2.value
                  }
                  onChange={this.handleOnChangeShipping}
                />
                <Form.Check
                  label={`Free ${SHIPPING_METHODS.FREE_SAME_DAY_DRONE.text} (weight < ${WEIGHT_THRESHOLD} lbs, subtotal >= $${SUBTOTAL_THRESHOLD})`}
                  type="radio"
                  name="shipping"
                  disabled={
                    subtotal < SUBTOTAL_THRESHOLD || weight >= WEIGHT_THRESHOLD
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
                  } (weight < ${WEIGHT_THRESHOLD} lbs, subtotal < $${SUBTOTAL_THRESHOLD})`}
                  type="radio"
                  name="shipping"
                  disabled={
                    subtotal >= SUBTOTAL_THRESHOLD || weight >= WEIGHT_THRESHOLD
                  }
                  value={SHIPPING_METHODS.COST_SAME_DAY_DRONE.value}
                  checked={
                    this.state.shippingMethod ===
                    SHIPPING_METHODS.COST_SAME_DAY_DRONE.value
                  }
                  onChange={this.handleOnChangeShipping}
                />
                <Form.Check
                  label={`Free ${SHIPPING_METHODS.FREE_TWO_DAY_TRUCK.text} (weight >= ${WEIGHT_THRESHOLD} lbs, subtotal >= $${SUBTOTAL_THRESHOLD})`}
                  type="radio"
                  name="shipping"
                  disabled={
                    subtotal < SUBTOTAL_THRESHOLD || weight < WEIGHT_THRESHOLD
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
                  } (weight >= ${WEIGHT_THRESHOLD} lbs, subtotal >= $${SUBTOTAL_THRESHOLD})`}
                  type="radio"
                  name="shipping"
                  disabled={
                    subtotal < SUBTOTAL_THRESHOLD || weight < WEIGHT_THRESHOLD
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
                  } (weight >= ${WEIGHT_THRESHOLD} lbs, subtotal < $${SUBTOTAL_THRESHOLD})`}
                  type="radio"
                  name="shipping"
                  disabled={
                    subtotal >= SUBTOTAL_THRESHOLD || weight < WEIGHT_THRESHOLD
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
                    pattern="^\d{16}$"
                    maxLength="16"
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Name on card</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="John Doe"
                    pattern="^[a-zA-Z]+(?: [a-zA-Z]+)*$"
                    maxLength="128"
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Expiration date (MM/YY)</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="01/22"
                    onChange={this.validateExpirationDate}
                    pattern="^\d{2}/\d{2}$"
                    maxLength="5"
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Security code</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="012"
                    pattern="^\d{3,4}$"
                    maxLength="4"
                  />
                </Form.Group>
              </Form.Row>
            </Col>
            <Col
              className="left-vertical-divider-lg py-3 pl-lg-5"
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
                            alt={item.product.name}
                          />
                          <span className="item-quantity">{item.quantity}</span>
                        </div>
                      </Link>
                    </Col>
                    <Col className="align-self-center">
                      <h5 className="mb-0">
                        $
                        {calculateItemSubtotal(
                          item.product.price,
                          item.quantity
                        )}
                      </h5>
                    </Col>
                  </Row>
                );
              })}
              <hr />
              <Row className="mb-3">
                <Col>
                  <h5>Weight</h5>
                </Col>
                <Col>
                  <h5>
                    {weight} lb{weight !== "1.0" ? "s" : ""}
                  </h5>
                </Col>
              </Row>
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
                  <Button
                    className="button-oval w-100"
                    type="submit"
                    disabled={this.state.submitted}
                  >
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

Checkout.propTypes = {
  history: PropTypes.object,
  signOut: PropTypes.func,
};

export default connect(null, { signOut })(withRouter(Checkout));
