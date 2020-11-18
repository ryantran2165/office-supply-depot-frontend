import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { driverSignOut } from "../../actions/auth-actions";
import axios from "axios";
import { API_URL } from "../../App";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Delivery from "./delivery";
import Map from "./map";

function Driver() {
  const [deliveries, setDeliveries] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const header = {
      headers: {
        Authorization: `JWT ${localStorage.getItem("driver-token")}`,
      },
    };
    axios
      .get(`${API_URL}/orders/list_deliveries/`, header)
      .then((res) => setDeliveries(res.data))
      .catch(() => tokenExpired(dispatch));
    // eslint-disable-next-line
  }, []);

  function handleOnClickGetDirections(delivery) {}

  function handleOnClickSubmitDelivery(id) {
    const header = {
      headers: {
        Authorization: `JWT ${localStorage.getItem("driver-token")}`,
      },
    };

    axios.get(`${API_URL}/orders/${id}/set_delivered`, header).then(() => {
      // Find the correct index to splice
      for (let i = 0; i < deliveries.length; i++) {
        if (deliveries[i].id === id) {
          deliveries.splice(i, 1);
          setDeliveries([...deliveries]);
          return;
        }
      }
    });
  }

  // Make sure deliveries is not null before rendering
  if (deliveries === null) {
    return "";
  }

  // No deliveries
  if (deliveries.length === 0) {
    return (
      <Container className="text-center py-5">
        <h1>No deliveries</h1>
      </Container>
    );
  }

  return (
    <Container className="py-5 px-md-5">
      <Row>
        <Col>
          <h3 className="mb-4">Your deliveries:</h3>
          {deliveries.map((delivery) => (
            <Delivery
              delivery={delivery}
              onClickGetDirections={handleOnClickGetDirections}
              onClickSubmitDelivery={handleOnClickSubmitDelivery}
              key={`delivery-${delivery.id}`}
            />
          ))}
          <div className="mt-5">
            <Map />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

function tokenExpired(dispatch) {
  dispatch(driverSignOut(dispatch));
  alert("Your token expired.\nPlease sign in again to use driver.");
}

export default Driver;
