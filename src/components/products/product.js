import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_URL } from "../../App";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function Product() {
  let { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartID, setCartID] = useState(-1);
  const history = useHistory();
  const signedIn = useSelector((state) => state.auth.signedIn);

  // On mount
  useEffect(() => {
    // Get product details from backend
    axios.get(`${API_URL}/products/${id}`).then((res) => {
      setProduct(res.data);

      // Out of stock
      if (res.data.inventory === 0) {
        setQuantity(0);
      }
    });

    // Check if this product is in cart
    if (signedIn) {
      const header = {
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      };
      axios.get(`${API_URL}/carts/`, header).then((res) => {
        const cart = res.data;
        for (let item of cart) {
          if (item.product === parseInt(id)) {
            setCartID(item.id);
            break;
          }
        }
      });
    }
  }, [id, signedIn]);

  function handleOnClickQuantity(newQuantity) {
    // Clamp quantity [1, product.inventory]
    if (newQuantity < 1) {
      newQuantity = 1;
    } else if (newQuantity > product.inventory) {
      newQuantity = product.inventory;
    }
    setQuantity(newQuantity);
  }

  function handleOnChangeQuantity(e) {
    const re = /^\d{1,3}$/;
    const newQuantity = parseInt(e.target.value);
    if (re.test(newQuantity)) {
      handleOnClickQuantity(newQuantity);
    }
  }

  function handleOnClickCart() {
    if (signedIn) {
      const header = {
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      };

      // Does not have item, add to cart (POST)
      if (cartID === -1) {
        const data = { product: id, quantity: quantity };
        axios.post(`${API_URL}/carts/`, data, header).then((res) => {
          setCartID(res.data.id);
        });
      } else {
        // Has product in cart, remove from cart (DELETE)
        axios.delete(`${API_URL}/carts/${cartID}`, header).then((res) => {
          setCartID(-1);
        });
      }
    } else {
      history.push("/sign-in");
    }
  }

  // Make sure product is not null before rendering
  if (product === null) {
    return "";
  }

  return (
    <Container fluid className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} lg={5}>
          <Image fluid src={product.img_url} />
        </Col>
        <Col className="ml-3" xs={12} lg={5}>
          <pre className="category-tag">
            {product.category}
            {product.subcategory !== "" ? ` | ${product.subcategory}` : ""}
          </pre>
          <h3>{product.name}</h3>
          <p className="product-description mt-3">{product.description}</p>
          <h4 className="mt-3">${product.price}</h4>
          <Row className="product-detail">
            <Col xs="auto">
              <Row className="mt-3">
                <Col>Weight:</Col>
              </Row>
              <Row className="mt-3">
                <Col>Inventory:</Col>
              </Row>
              <Row className="mt-3">
                <Col>Quantity:</Col>
              </Row>
            </Col>
            <Col>
              <Row className="mt-3">
                <Col>{product.weight} lbs</Col>
              </Row>
              <Row className="mt-3">
                <Col>{product.inventory} in stock</Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <Button
                    className="button-round"
                    onClick={() => handleOnClickQuantity(quantity - 1)}
                    disabled={product.inventory === 0}
                  >
                    -
                  </Button>
                  <Form.Control
                    type="text"
                    value={quantity}
                    className="quantity-input mx-3"
                    onChange={handleOnChangeQuantity}
                    disabled={product.inventory === 0}
                  />
                  <Button
                    className="button-round"
                    onClick={() => handleOnClickQuantity(quantity + 1)}
                    disabled={product.inventory === 0}
                  >
                    +
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <Button
            className="add-to-cart-button mt-3"
            value="Add to cart"
            onClick={handleOnClickCart}
            disabled={product.inventory === 0 && cartID === -1} // Always allow remove from cart
          >
            {cartID === -1 ? "Add to cart" : "Remove from cart"}
          </Button>
        </Col>
      </Row>
      <Row className="my-4">
        <Col>
          <hr className="product-hr" />
          <h4 className="text-center">Similar Products</h4>
          <hr className="product-hr" />
        </Col>
      </Row>
      <Row className="mx-5">
        <Col>
          <Image
            fluid
            src="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"
          />
        </Col>
        <Col>
          <Image
            fluid
            src="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"
          />
        </Col>
        <Col>
          <Image
            fluid
            src="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"
          />
        </Col>
        <Col>
          <Image
            fluid
            src="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"
          />
        </Col>
        <Col>
          <Image
            fluid
            src="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Product;
