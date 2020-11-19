import React, { useState } from "react";
import PropTypes from "prop-types";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

function Delivery({
  delivery,
  onClickSetOrigin,
  onClickSetDestination,
  onClickSubmitDelivery,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Accordion className="mt-3">
      <Card>
        <Accordion.Toggle
          className="hover-pointer"
          as={Card.Header}
          eventKey={`delivery-${delivery.id}-accordion`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Row>
            <Col className="text-left align-self-center" xs="auto">
              <h5>Delivery #{delivery.id}</h5>
            </Col>
            <Col className="text-right align-self-center">
              <h3>{isOpen ? "-" : "+"}</h3>
            </Col>
          </Row>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={`delivery-${delivery.id}-accordion`}>
          <React.Fragment>
            <Card.Body>
              <p>
                {delivery.first_name} {delivery.last_name}
                <br />
                {delivery.address_1}
                {delivery.address_2 !== "" ? `, ${delivery.address_2}` : ""}
                <br />
                {delivery.city}, {delivery.state} {delivery.zip_code}
                <br />
                {delivery.phone}
              </p>
              <Button className="button-orange mr-3" onClick={onClickSetOrigin}>
                Set origin
              </Button>
              <Button className="button-orange" onClick={onClickSetDestination}>
                Set destination
              </Button>
            </Card.Body>
            <Card.Footer>
              <Button onClick={onClickSubmitDelivery}>Submit delivery</Button>
            </Card.Footer>
          </React.Fragment>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}

Delivery.propTypes = {
  delivery: PropTypes.object,
  onClickSetOrigin: PropTypes.func,
  onClickSetDestination: PropTypes.func,
  onClickSubmitDelivery: PropTypes.func,
};

export default Delivery;
