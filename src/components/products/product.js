import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../App";
import Container from "react-bootstrap/Container";

function Product() {
  // State
  let { id } = useParams();
  const [product, setProduct] = useState(null);

  // On mount, get product details from backend
  useEffect(() => {
    axios.get(`${API_URL}/products/${id}`).then((res) => {
      setProduct(res.data);
    });
  }, [id]);

  // Make sure product is not null before rendering
  return <Container>{product ? <h1>{product.name}</h1> : ""}</Container>;
}

export default Product;
