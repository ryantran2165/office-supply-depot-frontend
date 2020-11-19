import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { driverSignOut } from "../../actions/auth-actions";
import axios from "axios";
import { API_URL } from "../../App";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Delivery from "./delivery";
import Map from "./map";

function Driver() {
  const [deliveries, setDeliveries] = useState(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [newRequest, setNewRequest] = useState(false);
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
              onClickSetDestination={() =>
                setDestination(
                  `${delivery.address_1}, ${delivery.city}, ${delivery.state} ${delivery.zip_code}`
                )
              }
              onClickSubmitDelivery={() =>
                handleOnClickSubmitDelivery(delivery.id)
              }
              key={`delivery-${delivery.id}`}
            />
          ))}
          <Form
            className="mt-5 mb-3"
            onSubmit={(e) => {
              e.preventDefault();
              setNewRequest(true);
            }}
          >
            <Form.Group>
              <Form.Label>Origin</Form.Label>
              <Form.Control
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Destination</Form.Label>
              <Form.Control
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </Form.Group>
            <Button type="submit">Get directions</Button>
          </Form>
          <Map
            origin={origin}
            destination={destination}
            newRequest={newRequest}
            requestHandled={() => setNewRequest(false)}
          />
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
