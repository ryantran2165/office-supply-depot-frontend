import React, { useState } from "react";
import PropTypes from "prop-types";
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
          className="hover-pointer"
          as={Card.Header}
          eventKey={`filter-${title}-accordion`}
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
        <Accordion.Collapse eventKey={`filter-${title}-accordion`}>
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
                    eventKey={`activeKey-${link}`}
                    key={`filter-${link}`}
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

ProductFilter.propTypes = {
  title: PropTypes.string,
  activeKey: PropTypes.string,
  links: PropTypes.array,
  onClickLink: PropTypes.func,
  customElement: PropTypes.element,
};

export default ProductFilter;
