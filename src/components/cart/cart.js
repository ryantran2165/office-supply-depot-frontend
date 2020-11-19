import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOut } from "../../actions/auth-actions";
import axios from "axios";
import { API_URL } from "../../App";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import { calculateSubtotal } from "../money";

function Cart() {
  const [cart, setCart] = useState(null);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line
  }, []);

  function loadCart() {
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

  function handleOnChangeQuantity(quantity, item) {
    const re = /^\d{1,3}$/;

    // Failed regex: 1 to 3 digit number
    if (!re.test(quantity)) {
      return;
    }

    // Clamp
    quantity = Math.max(quantity, 1);
    quantity = Math.min(quantity, item.product.inventory);

    // Check if inventory has changed
    axios.get(`${API_URL}/products/${item.product.id}`).then((res) => {
      // Has enough inventory
      if (quantity <= res.data.inventory) {
        const header = {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        };
        const data = {
          quantity: quantity,
        };

        axios
          .patch(`${API_URL}/carts/${item.id}/`, data, header)
          .then(() => {
            const cartCopy = [...cart];

            // Set new quantity on corresponding item of cart copy
            for (const itemCopy of cartCopy) {
              if (itemCopy.id === item.id) {
                itemCopy.quantity = quantity;
                break;
              }
            }

            setCart(cartCopy);
          })
          .catch(() => tokenExpired(dispatch));
      } else {
        // Not enough inventory, reload cart
        loadCart();
        alert(
          "The product's inventory has changed.\nPlease choose a new quantity."
        );
      }
    });
  }

  function handleOnClickRemove(e, itemID) {
    // Prevent multiple clicks
    if (e.target.disabled) {
      return;
    }
    e.target.disabled = true;

    const header = {
      headers: {
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };

    axios
      .delete(`${API_URL}/carts/${itemID}`, header)
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

      for (const product of products) {
        for (const item of cart) {
          if (product.id === item.product.id) {
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

  return (
    <Container fluid className="py-5 px-md-5">
      <Row>
        <Col className="py-3">
          <h3 className="mb-3">
            Your cart: {cart.length} item{cart.length > 1 ? "s" : ""}
          </h3>
          <Table responsive>
            <thead className="text-center">
              <tr>
                <th></th>
                <th>
                  <h5 className="mb-0">Product</h5>
                </th>
                <th>
                  <h5 className="mb-0">Price</h5>
                </th>
                <th>
                  <h5 className="mb-0">Quantity</h5>
                </th>
                <th>
                  <h5 className="mb-0">Subtotal</h5>
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {cart.map((item) => {
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
                      <h5 className="mb-0">${item.product.price}</h5>
                    </td>
                    <td className="align-middle text-center">
                      <Row>
                        <Col style={{ minWidth: "200px" }}>
                          <Button
                            className="button-round"
                            onClick={() =>
                              handleOnChangeQuantity(item.quantity - 1, item)
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
                                parseInt(e.target.value),
                                item
                              )
                            }
                            disabled={item.product.inventory === 0}
                            aria-label="Quantity input"
                          />
                          <Button
                            className="button-round"
                            onClick={() =>
                              handleOnChangeQuantity(item.quantity + 1, item)
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
                      <h5 className="mb-0">${calculateSubtotal([item])}</h5>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
        <Col className="left-vertical-divider py-3" xs={12} lg={3}>
          <Row className="mb-3">
            <Col>
              <h5>Subtotal</h5>
            </Col>
            <Col className="text-right">
              <h5>${calculateSubtotal(cart)}</h5>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                className="button-oval w-100"
                onClick={handleOnClickCheckout}
              >
                Check out
              </Button>
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
