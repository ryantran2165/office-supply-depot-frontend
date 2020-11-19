import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Col from "react-bootstrap/Col";
import SquareImage from "../square-image";

function ProductBox({ product, xs, sm, md, lg, xl }) {
  return (
    <Col className="mb-3" xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
      <Link className="link-hover-black" to={`/products/${product.id}`}>
        <SquareImage src={product.img_url} />
        <h5 className="mt-3">{product.name}</h5>
        <h5>${product.price}</h5>
      </Link>
    </Col>
  );
}

ProductBox.propTypes = {
  product: PropTypes.object,
  xs: PropTypes.number,
  sm: PropTypes.number,
  md: PropTypes.number,
  lg: PropTypes.number,
  xl: PropTypes.number,
};

export default ProductBox;
