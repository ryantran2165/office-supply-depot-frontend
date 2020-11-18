import React, { useState } from "react";
import { Link } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import { calculateItemTotal, addMonies } from "../money";
import { SHIPPING_METHODS } from "../shipping";

function Order({ order }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Accordion className="mt-3">
      <Card>
        <Accordion.Toggle
          className="hover-pointer"
          as={Card.Header}
          eventKey={`order-${order.id}-accordion`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Row>
            <Col className="text-left align-self-center" xs="auto">
              <h5>Order #{order.id}</h5>
              <h6>{order.date_ordered.split("T")[0]}</h6>
              <h6>
                {order.date_delivered === null
                  ? "Order is processing"
                  : `Delivered on ${order.date_delivered.split("T")[0]}`}
              </h6>
              <hr />
              <p>
                {order.first_name} {order.last_name}
                <br />
                {order.address_1}
                {order.address_2 !== "" ? `, ${order.address_2}` : ""}
                <br />
                {order.city}, {order.state} {order.zip_code}
                <br />
                {order.phone}
              </p>
            </Col>
            <Col className="text-right align-self-center">
              <h3>{isOpen ? "-" : "+"}</h3>
            </Col>
          </Row>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={`order-${order.id}-accordion`}>
          <React.Fragment>
            <ListGroup variant="flush">
              {order.items.map((item, i) => {
                // Previously purchased product is now deleted
                if (item.product === null) {
                  return (
                    <ListGroup.Item key={`order-${order.id}-null-${i}`}>
                      <Row>
                        <Col>*unavailable product* ({item.quantity})</Col>
                        <Col className="text-right">
                          ${item.price} x {item.quantity} = $
                          {calculateItemTotal(item.price, item.quantity)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  );
                } else {
                  return (
                    <Link
                      className="link-hover-black"
                      to={`/products/${item.product.id}`}
                      key={`order-${order.id}-${item.product.id}`}
                    >
                      <ListGroup.Item>
                        <Row>
                          <Col>
                            {item.product.name} ({item.quantity})
                          </Col>
                          <Col className="text-right">
                            ${item.price} x {item.quantity} = $
                            {calculateItemTotal(item.price, item.quantity)}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    </Link>
                  );
                }
              })}
            </ListGroup>
            <Card.Footer>
              <h6>Subtotal: ${order.subtotal}</h6>
              <h6>Tax: ${order.tax}</h6>
              <h6>
                Shipping: ${order.shipping_cost} (
                {SHIPPING_METHODS[order.shipping_method].text})
              </h6>
              <hr />
              <h6>
                Total: $
                {addMonies([order.subtotal, order.tax, order.shipping_cost])}
              </h6>
            </Card.Footer>
          </React.Fragment>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}

export default Order;
