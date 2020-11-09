import React from "react";
import { Link } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";

function ProductBox({ product }) {
  return (
    <Col className="product-box mb-3" xs={6} lg={4} xl={3}>
      <Link to={`/products/${product.id}`}>
        <Image fluid rounded className="shadow" src={product.img_url} />
        <h5 className="mt-3">{product.name}</h5>
        <h5>${product.price}</h5>
      </Link>
    </Col>
  );
}

export default ProductBox;
