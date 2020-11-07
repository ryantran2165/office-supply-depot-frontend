import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../App";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";

function Cart() {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    // Load cart data
    const header = {
      headers: {
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };
    axios.get(`${API_URL}/carts/`, header).then((res) => {
      const cart = res.data;
      setCart(cart);

      // Replace product ids with actual products
      for (let item of cart) {
        axios.get(`${API_URL}/products/${item.product}`).then((res) => {
          item.product = res.data;
          setCart([...cart]);
        });
      }
    });
  }, []);

  // Make sure cart is not null before rendering
  if (cart === null) {
    return "";
  }

  // Empty cart
  if (cart.length === 0) {
    return (
      <Container className="text-center py-3">
        <h1>Cart is empty</h1>
      </Container>
    );
  }

 
  return (
    <Container className="py-3 d-flex">
      <Col>
        <h3>Your cart: items</h3>
        {cart.map((item) => {
          return (
            <Container>
              <hr></hr>
              <Row>
                <Col></Col>
                <Col><span className="bold-title">Item name</span></Col>
                <Col><span className="bold-title">Price</span></Col>
                <Col><span className="bold-title">Quantity</span></Col>
                <Col><span className="bold-title">Subtotal</span></Col>
              </Row>
              <hr></hr>
              <Row className=" r">
                <Col>
                  <Image rounded fluid src={item.product.img_url}></Image> 
                </Col>
                <Col>{item.product.name}</Col>
                <Col>{item.product.price}</Col>
                <Col>
                  <Row>{item.quantity}</Row>
                  <Row className="d-flex">
                    <Button className="text-button">Remove</Button>
                    <Button className="text-button vertical-divider">Save for later</Button>
                  </Row>
                </Col>
                <Col>$$$</Col>
              </Row>
            </Container>
          );
        })}
        <Container>
          <hr></hr>
          <h3>Saved items: </h3>
          <Row className="d-flex justify-content-center">
                <Col>
                  <Image fluid src="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg" className="cart-product-img"></Image>
                </Col>
                <Col>Price</Col>
                <Col>
                  <Row className="d-flex">
                    <Button className="text-button">Remove</Button>
                    <Button className="text-button vertical-divider">Move to cart</Button>
                  </Row>
                </Col>
                <Col>$$$</Col>
              </Row>
        </Container>
      </Col>
      <Col className="col-2 vertical-divider">
        <Row>
          <Col xs="auto">
            <Row>
              <Col>Subtotal</Col>
            </Row>
            <Row>
              <Col>Delivery</Col>
            </Row>
          </Col>
          <Col>
            <Row>
              <Col>$$$</Col>
            </Row>
            <Row>
              <Col>$$$</Col>
            </Row>
          </Col>
        </Row>
        <Row className="col text-center my-2">
          <Button className="button-oval">Check out</Button>
        </Row>
      </Col>
    </Container>
  );
}

export default Cart;