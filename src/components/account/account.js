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
        const ordersData = res.data;
        const tempOrders = [];

        // To indicate that orders are loaded but empty
        if (ordersData.length === 0) {
          setOrders(tempOrders);
          return;
        }

        for (const order of ordersData) {
          // Resolve all products first
          const promises = [];

          for (const item of order.items) {
            // Previously purchased product is now deleted
            if (item.product === null) {
              continue;
            }

            // Add the promise to the list
            const promise = axios.get(`${API_URL}/products/${item.product}`);
            promises.push(promise);
          }

          Promise.all(promises).then((res) => {
            const products = res.map((promise) => promise.data);

            // Replace product id with actual product
            for (const product of products) {
              for (const item of order.items) {
                if (product.id === item.product) {
                  item.product = product;
                  break;
                }
              }
            }

            tempOrders.push(order);
            tempOrders.sort((a, b) =>
              b.date_ordered.localeCompare(a.date_ordered)
            );
            setOrders([...tempOrders]);
          });
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
          {orders.map((order) => {
            return <Order order={order} key={`order-${order.id}`} />;
          })}
        </Col>
      </Row>
    </Container>
  );
}

export default Account;
