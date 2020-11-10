import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

function Cart() {
  const [cart, setCart] = useState(null);
  const dispatch = useDispatch();

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
        const cart = [];

        // To indicate that cart is loaded but empty
        if (res.data.length === 0) {
          setCart(cart);
        }

        // Replace product ids with actual products and add one at a time
        for (let item of res.data) {
          axios.get(`${API_URL}/products/${item.product}`).then((res) => {
            item.product = res.data;
            cart.push(item);
            setCart([...cart]);
          });
        }
      })
      .catch(() => {
        tokenExpired();
      });
  }

  function calculateSubtotal(items) {
    let totalDollars = 0;
    let totalCents = 0;
    for (let item of items) {
      const [dollars, cents] = item.product.price.split(".");
      totalDollars += parseInt(dollars) * item.quantity;
      totalCents += parseInt(cents) * item.quantity;
    }
    const dollarsFromCents = Math.floor(totalCents / 100);
    const remainingCents = totalCents % 100;
    totalDollars += dollarsFromCents;
    return `${totalDollars}.${remainingCents < 10 ? "0" : ""}${remainingCents}`;
  }

  function handleOnChangeQuantity(e, item) {
    const re = /^\d{1,3}$/;
    let quantity = parseInt(e.target.value);

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
          .then((res) => {
            const cartCopy = [...cart];

            // Set new quantity on corresponding item of cart copy
            for (let itemCopy of cartCopy) {
              if (itemCopy.id === item.id) {
                itemCopy.quantity = quantity;
              }
            }

            setCart(cartCopy);
          })
          .catch((err) => {
            tokenExpired();
          });
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
      .then((res) => {
        // Find the correct index to splice
        for (let i = 0; i < cart.length; i++) {
          if (cart[i].id === itemID) {
            cart.splice(i, 1);
            setCart([...cart]);
            return;
          }
        }
      })
      .catch((err) => {
        tokenExpired();
      });
  }

  function handleOnClickCheckout() {
    // Check all quantities are <= the available stock
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i];

      axios.get(`${API_URL}/products/${item.product.id}`).then((res) => {
        // Not enough inventory
        if (item.quantity > res.data.inventory) {
          loadCart();
          alert(
            "Some products' inventories have changed.\nPlease reduce quantities that are greater than the available stock or remove the product."
          );
          return;
        } else if (i === cart.length - 1) {
          // All quantities valid, change page to checkout
        }
      });
    }
  }

  function tokenExpired() {
    dispatch(signOut());
    alert("Your token expired.\nPlease sign in again to use cart.");
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
    <Container fluid className="pb-5 px-md-5">
      <Row>
        <Col className="py-3">
          <Row>
            <Col>
              <h3>
                Your cart: {cart.length} item{cart.length > 1 ? "s" : ""}
              </h3>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col></Col>
            <Col>
              <h5>Product</h5>
            </Col>
            <Col>
              <h5>Price</h5>
            </Col>
            <Col>
              <h5>Quantity</h5>
            </Col>
            <Col>
              <h5>Subtotal</h5>
            </Col>
          </Row>
          <hr />
          {cart.map((item) => {
            return (
              <Row className="mb-3" key={item.id}>
                <Col>
                  <Link to={`/products/${item.product.id}`}>
                    <Image
                      rounded
                      fluid
                      className="cart-img shadow"
                      src={item.product.img_url}
                    ></Image>
                  </Link>
                </Col>
                <Col>
                  <Link
                    className="link-hover-black"
                    to={`/products/${item.product.id}`}
                  >
                    <h5>{item.product.name}</h5>
                  </Link>
                </Col>
                <Col>
                  <h5>${item.product.price}</h5>
                </Col>
                <Col>
                  <Row>
                    <Col>
                      <Form.Control
                        className="quantity-input"
                        type="text"
                        value={item.quantity}
                        onChange={(e) => handleOnChangeQuantity(e, item)}
                        disabled={item.product.inventory === 0}
                      />
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
                </Col>
                <Col>
                  <h5>${calculateSubtotal([item])}</h5>
                </Col>
              </Row>
            );
          })}
        </Col>
        <Col className="vertical-divider py-3" xs={12} lg={3}>
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

export default Cart;
