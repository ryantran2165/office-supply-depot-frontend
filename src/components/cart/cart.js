import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../App";
import Container from "react-bootstrap/Container";

function Cart() {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    const header = {
      headers: {
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };
    axios.get(`${API_URL}/carts/`, header).then((res) => {
      setCart(res.data);
    });
  }, []);

  if (cart === null) {
    return "";
  }

  return (
    <Container>
      {cart.map((item) => {
        return (
          <div key={item.id}>
            <h3>ID: {item.id}</h3>
            <h3>Product: {item.product}</h3>
            <h3>Quantity: {item.quantity}</h3>
            <br />
          </div>
        );
      })}
    </Container>
  );
}

export default Cart;
