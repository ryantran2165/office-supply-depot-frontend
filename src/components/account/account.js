import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { signOut } from "../../actions/auth-actions";
import axios from "axios";
import { API_URL } from "../../App";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Order from "./order";

function Account() {
  const [orders, setOrders] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const header = {
      headers: {
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };
    axios
      .get(`${API_URL}/orders/`, header)
      .then((res) => {
        const orders = [];

        // To indicate that orders are loaded but empty
        if (res.data.length === 0) {
          setOrders(orders);
        }

        // Replace product ids with actual products and add one at a time
        for (let order of res.data) {
          for (let i = 0; i < order.items.length; i++) {
            const item = order.items[i];

            // Previously purchased product is now deleted
            if (item.product === null) {
              if (i === order.items.length - 1) {
                orders.push(order);
                orders.sort((a, b) =>
                  b.date_ordered.localeCompare(a.date_ordered)
                );
                setOrders([...orders]);
              }
              continue;
            }

            axios.get(`${API_URL}/products/${item.product}`).then((res) => {
              item.product = res.data;

              // Update orders after loading the last product
              if (i === order.items.length - 1) {
                orders.push(order);
                orders.sort((a, b) =>
                  b.date_ordered.localeCompare(a.date_ordered)
                );
                setOrders([...orders]);
              }
            });
          }
        }
      })
      .catch(() => {
        tokenExpired();
      });
    // eslint-disable-next-line
  }, []);

  function tokenExpired() {
    dispatch(signOut());
    alert("Your token expired.\nPlease sign in again to use account.");
  }

  // Make sure orders is not null before rendering
  if (orders === null) {
    return "";
  }

  // No orders
  if (orders.length === 0) {
    return (
      <Container className="text-center py-5">
        <h1>No orders placed</h1>
      </Container>
    );
  }

  return (
    <Container className="py-5 px-md-5">
      <Row>
        <Col>
          <h3 className="mb-4">Your orders:</h3>
          {orders.map((order) => (
            <Order order={order} key={order.id} />
          ))}
        </Col>
      </Row>
    </Container>
  );
}

export default Account;
