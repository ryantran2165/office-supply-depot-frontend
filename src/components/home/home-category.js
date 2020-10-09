import React from "react";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";

function HomeCategory({ categoryName, imgSrc }) {
  return (
    <Col xs={6} md={4} lg={2}>
      <Image fluid rounded src={imgSrc} alt="Img of category" />
      <h5>{categoryName}</h5>
    </Col>
  );
}

export default HomeCategory;
