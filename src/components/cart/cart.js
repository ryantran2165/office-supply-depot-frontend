import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../App";
import Container from "react-bootstrap/Container";

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
      <Container className="text-center py-5">
        <h1>Cart is empty</h1>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {cart.map((item) => {
        return (
          <div key={item.id}>
            <h3>Product: {item.product.name}</h3>
            <h3>Quantity: {item.quantity}</h3>
            <br />
          </div>
        );
      })}
    </Container>
  );
}

export default Cart;
