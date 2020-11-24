import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOut } from "../../actions/auth-actions";
import axios from "axios";
import { API_URL, getAuthHeader } from "../../App";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import {
  calculateItemSubweight,
  addWeights,
  calculateItemSubtotal,
  addPrices,
} from "../calculations";

function Cart() {
  const [cart, setCart] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line
  }, []);

  function loadCart() {
    axios
      .get(`${API_URL}/carts/`, getAuthHeader())
      .then((res) => {
        const cartData = res.data;

        // To indicate that cart is loaded but empty
        if (cartData.length === 0) {
          setCart([]);
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
          setCart(cartData);
        });
      })
      .catch(() => tokenExpired(dispatch));
  }

  function handleOnChangeQuantity(quantity, i, inventory) {
    const re = /^\d{1,3}$/;

    if (quantity === "") {
      changeQuantity("", i);
    } else if (re.test(quantity)) {
      quantity = Math.max(quantity, 1);
      quantity = Math.min(quantity, inventory);
      changeQuantity(quantity, i);
    }
  }

  function handleOnBlurQuantity(quantity, i) {
    if (quantity === "") {
      changeQuantity(1, i);
    }
  }

  function changeQuantity(quantity, i) {
    const cartCopy = [...cart];
    cartCopy[i].quantity = quantity;
    setCart(cartCopy);
  }

  function handleOnClickSave() {
    const promises = [];
    setIsSaving(true);
    setMessage("");

    for (const item of cart) {
      const data = { quantity: item.quantity };
      const promise = axios.patch(
        `${API_URL}/carts/${item.id}/`,
        data,
        getAuthHeader()
      );
      promises.push(promise);
    }

    Promise.all(promises)
      .then(() => {
        setIsSaving(false);
        setMessage("Cart successfully saved!");
      })
      .catch(() => tokenExpired(dispatch));
  }

  function handleOnClickRemove(e, itemID) {
    // Prevent multiple clicks
    if (e.target.disabled) {
      return;
    }
    e.target.disabled = true;

    axios
      .delete(`${API_URL}/carts/${itemID}`, getAuthHeader())
      .then(() => {
        // Find the correct index to splice
        for (let i = 0; i < cart.length; i++) {
          if (cart[i].id === itemID) {
            cart.splice(i, 1);
            setCart([...cart]);
            return;
          }
        }
      })
      .catch(() => tokenExpired(dispatch));
  }

  function handleOnClickCheckout() {
    const promises = [];

    // Check all quantities are <= the available stock
    for (const item of cart) {
      const promise = axios.get(`${API_URL}/products/${item.product.id}`);
      promises.push(promise);
    }

    Promise.all(promises).then((res) => {
      const products = res.map((promise) => promise.data);

      // Get saved cart, not the current temporary cart
      axios
        .get(`${API_URL}/carts/`, getAuthHeader())
        .then((res) => {
          const cart = res.data;

          for (const product of products) {
            for (const item of cart) {
              if (product.id === item.product) {
                // Not enough inventory
                if (item.quantity > product.inventory) {
                  loadCart();
                  alert(
                    "Some products' inventories have changed.\nPlease reduce quantities that are greater than the available stock or remove the product."
                  );
                  return;
                }
              }
            }
          }

          // All quantities valid, change page to checkout
          history.push("/checkout");
        })
        .catch(() => tokenExpired(dispatch));
    });
  }

  // Make sure cart is not null before rendering
  if (cart === null) {
    return "";
  }

  // Empty cart
  if (cart.length === 0) {
    return (
      <Container className="text-center py-5">
        <h1>Cart is empty</h1>
      </Container>
    );
  }

  const weight = addWeights(
    cart.map((item) =>
      calculateItemSubweight(item.product.weight, item.quantity)
    )
  );
  const subtotal = addPrices(
    cart.map((item) => calculateItemSubtotal(item.product.price, item.quantity))
  );

  return (
    <Container fluid className="py-5 px-xl-5">
      <Row>
        <Col className="py-3">
          {message !== "" && <Alert variant="success">{message}</Alert>}
          <Row>
            <Col>
              <h3 className="mb-3">
                Your cart: {cart.length} item{cart.length > 1 ? "s" : ""}
              </h3>
            </Col>
            <Col className="text-right">
              <Button onClick={handleOnClickSave} disabled={isSaving}>
                Save cart
              </Button>
            </Col>
          </Row>
          <Table responsive>
            <thead className="text-center">
              <tr>
                <th></th>
                <th>
                  <h5 className="mb-0">Product</h5>
                </th>
                <th>
                  <h5 className="mb-0">Weight (lbs)</h5>
                </th>
                <th>
                  <h5 className="mb-0">Price ($)</h5>
                </th>
                <th>
                  <h5 className="mb-0">Quantity</h5>
                </th>
                <th>
                  <h5 className="mb-0">Sub-weight (lbs)</h5>
                </th>
                <th>
                  <h5 className="mb-0">Subtotal ($)</h5>
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {cart.map((item, i) => {
                return (
                  <tr key={`cart-${item.id}`}>
                    <td className="text-center">
                      <Link to={`/products/${item.product.id}`}>
                        <Image
                          rounded
                          className="square-image-fixed shadow"
                          src={item.product.img_url}
                          alt={item.product.name}
                        />
                      </Link>
                    </td>
                    <td className="align-middle">
                      <Link
                        className="link-hover-black"
                        to={`/products/${item.product.id}`}
                      >
                        <h5 className="d-inline">{item.product.name}</h5>
                      </Link>
                    </td>
                    <td className="align-middle">
                      <h5 className="mb-0">{item.product.weight.toFixed(1)}</h5>
                    </td>
                    <td className="align-middle">
                      <h5 className="mb-0">{item.product.price}</h5>
                    </td>
                    <td className="align-middle text-center">
                      <Row>
                        <Col style={{ minWidth: "225px" }}>
                          <Button
                            className="button-round"
                            onClick={() =>
                              handleOnChangeQuantity(
                                item.quantity - 1,
                                i,
                                item.product.inventory
                              )
                            }
                            disabled={item.product.inventory === 0}
                            aria-label="Decrease quantity"
                          >
                            -
                          </Button>
                          <Form.Control
                            className="quantity-input mx-3"
                            type="text"
                            value={item.quantity}
                            onChange={(e) =>
                              handleOnChangeQuantity(
                                e.target.value === ""
                                  ? ""
                                  : parseInt(e.target.value),
                                i,
                                item.product.inventory
                              )
                            }
                            onBlur={() =>
                              handleOnBlurQuantity(item.quantity, i)
                            }
                            disabled={item.product.inventory === 0}
                            aria-label="Quantity input"
                          />
                          <Button
                            className="button-round"
                            onClick={() =>
                              handleOnChangeQuantity(
                                item.quantity + 1,
                                i,
                                item.product.inventory
                              )
                            }
                            disabled={item.product.inventory === 0}
                            aria-label="Increase quantity"
                          >
                            +
                          </Button>
                        </Col>
                      </Row>
                      <Row>
                        <Col>{item.product.inventory} in stock</Col>
                      </Row>
                      <Row>
                        <Col>
                          <span
                            className="hover-pointer font-weight-bold"
                            onClick={(e) => handleOnClickRemove(e, item.id)}
                          >
                            Remove
                          </span>
                        </Col>
                      </Row>
                    </td>
                    <td className="align-middle">
                      <h5 className="mb-0">
                        {calculateItemSubweight(
                          item.product.weight,
                          item.quantity
                        )}
                      </h5>
                    </td>
                    <td className="align-middle">
                      <h5 className="mb-0">
                        {calculateItemSubtotal(
                          item.product.price,
                          item.quantity
                        )}
                      </h5>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
        <Col className="left-vertical-divider-xl py-3" xs={12} xl={3}>
          <Row className="mb-3">
            <Col>
              <h5>Weight</h5>
            </Col>
            <Col className="text-right">
              <h5>
                {weight} lb{weight !== "1.0" ? "s" : ""}
              </h5>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <h5>Subtotal</h5>
            </Col>
            <Col className="text-right">
              <h5>${subtotal}</h5>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                className="button-oval w-100 mb-3"
                onClick={handleOnClickCheckout}
                disabled={isSaving}
              >
                Check out
              </Button>
              <Alert variant="warning">Did you save your cart?</Alert>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

function tokenExpired(dispatch) {
  dispatch(signOut());
  alert("Your token expired.\nPlease sign in again to use cart.");
}

export default Cart;
