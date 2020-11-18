import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCategory } from "../../actions/products-actions";
import Col from "react-bootstrap/Col";
import SquareImage from "../square-image";

function HomeCategory({ categoryName, imgSrc }) {
  const dispatch = useDispatch();

  return (
    <Col className="mb-3" xs={6} sm={5} md={4} lg={2}>
      <Link
        className="link-hover-black"
        to="/products"
        onClick={() => dispatch(setCategory(categoryName))}
      >
        <SquareImage src={imgSrc} />
        <h5>{categoryName}</h5>
      </Link>
    </Col>
  );
}

export default HomeCategory;
