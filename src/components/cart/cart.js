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

// TODO: Handle case of out of stock
// TODO: Handle check out button
function Cart() {
  const [cart, setCart] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // Load cart data
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
    // eslint-disable-next-line
  }, []);

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

  function getQuantity(itemID) {
    for (let item of cart) {
      if (item.id === itemID) {
        return item.quantity;
      }
    }
    return -1;
  }

  function handleOnChangeQuantity(e, itemID) {
    const cartCopy = [...cart];

    for (let item of cartCopy) {
      if (item.id === itemID) {
        const re = /^\d{1,3}$/;
        let newQuantity = parseInt(e.target.value);

        if (re.test(newQuantity)) {
          newQuantity = Math.max(newQuantity, 1);
          newQuantity = Math.min(newQuantity, item.product.inventory);
          item.quantity = newQuantity;

          const header = {
            headers: {
              Authorization: `JWT ${localStorage.getItem("token")}`,
            },
          };

          const data = {
            quantity: newQuantity,
          };

          axios
            .patch(`${API_URL}/carts/${itemID}/`, data, header)
            .then((res) => {
              setCart(cartCopy);
            })
            .catch((err) => {
              tokenExpired();
            });
        }
      }
    }
  }

  function handleOnClickRemove(itemID) {
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
                        value={getQuantity(item.id)}
                        onChange={(e) => handleOnChangeQuantity(e, item.id)}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <span
                        className="hover-pointer"
                        onClick={() => handleOnClickRemove(item.id)}
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
              <Button className="button-oval w-100">Check out</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Cart;
