import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";

function ProductFilter({
  title,
  activeKey,
  links,
  onClickLink,
  customElement,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Accordion>
      <Card>
        <Accordion.Toggle
          as={Card.Header}
          eventKey={`${title}-accordion`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Row>
            <Col className="text-left">
              <h5>{title}</h5>
            </Col>
            <Col className="text-right">
              <h5>{isOpen ? "-" : "+"}</h5>
            </Col>
          </Row>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={`${title}-accordion`}>
          <Card.Body>
            <Nav className="flex-column" activeKey={activeKey}>
              {links.map((link) => {
                return (
                  <Nav.Link
                    className="filter-link"
                    onClick={() => {
                      setIsOpen(false);
                      onClickLink(link);
                    }}
                    eventKey={link}
                    key={link}
                  >
                    {link}
                  </Nav.Link>
                );
              })}
              {customElement}
            </Nav>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}

export default ProductFilter;
