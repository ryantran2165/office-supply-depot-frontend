import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../../actions/auth-actions";
import axios from "axios";
import { API_URL } from "../../App";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ProductBox from "./product-box";

const NUM_SIMILAR = 4;

function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartID, setCartID] = useState(-1);
  const [similar, setSimilar] = useState([]);
  const [isFoundProduct, setIsFoundProduct] = useState(true);
  const [isCartButtonDisabled, setIsCartButtonDisabled] = useState(false);
  const history = useHistory();
  const signedIn = useSelector((state) => state.auth.signedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    // Get product details from backend
    axios
      .get(`${API_URL}/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setQuantity(res.data.inventory === 0 ? 0 : 1);
        setCartID(-1);

        // This is nested because order of setQuantity
        if (signedIn) {
          const header = {
            headers: {
              Authorization: `JWT ${localStorage.getItem("token")}`,
            },
          };

          // Check if this product is in cart
          axios
            .get(`${API_URL}/carts/`, header)
            .then((res) => {
              for (let item of res.data) {
                // id is a String because it comes from url params
                if (item.product === parseInt(id)) {
                  setCartID(item.id);
                  setQuantity(item.quantity);
                  return;
                }
              }
            })
            .catch((err) => {
              tokenExpired();
            });
        }

        // Get similar products
        axios
          .get(
            `${API_URL}/products/list_similar/?id=${id}&items=${NUM_SIMILAR}`
          )
          .then((res) => {
            setSimilar(res.data);
          });
      })
      .catch((err) => {
        setIsFoundProduct(false);
      });
    // eslint-disable-next-line
  }, [id, signedIn]);

  function handleOnClickQuantity(quantity) {
    quantity = Math.max(quantity, 1);
    quantity = Math.min(quantity, product.inventory);
    setQuantity(quantity);
  }

  function handleOnChangeQuantity(e) {
    const re = /^\d{1,3}$/;
    const quantity = parseInt(e.target.value);

    if (re.test(quantity)) {
      handleOnClickQuantity(quantity);
    }
  }

  function handleOnClickCart() {
    // Prevent multiple clicks before backend processing is finished
    if (isCartButtonDisabled) {
      return;
    }
    setIsCartButtonDisabled(true);

    // Must sign in to add to cart
    if (!signedIn) {
      history.push("/signin");
      return;
    }

    const header = {
      headers: {
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };

    // Does not have item, add to cart (POST)
    if (cartID === -1) {
      // Check if inventory has changed
      axios.get(`${API_URL}/products/${id}`).then((res) => {
        // Has enough inventory
        if (quantity <= res.data.inventory) {
          const data = { product: id, quantity: quantity };

          axios
            .post(`${API_URL}/carts/`, data, header)
            .then((res) => {
              setCartID(res.data.id);
              setIsCartButtonDisabled(false);
            })
            .catch((err) => {
              setIsCartButtonDisabled(false);
              tokenExpired();
            });
        } else {
          // Not enough inventory, update the page
          setProduct(res.data);
          setQuantity(res.data.inventory === 0 ? 0 : 1);
          setIsCartButtonDisabled(false);
          alert(
            "The product's inventory has changed.\nPlease choose a new quantity."
          );
        }
      });
    } else {
      // Has product in cart, remove from cart (DELETE)
      axios
        .delete(`${API_URL}/carts/${cartID}`, header)
        .then((res) => {
          setCartID(-1);
          setQuantity(product.inventory === 0 ? 0 : 1);
          setIsCartButtonDisabled(false);
        })
        .catch((err) => {
          setIsCartButtonDisabled(false);
          tokenExpired();
        });
    }
  }

  function tokenExpired() {
    dispatch(signOut());
    alert("Your token expired.\nPlease sign in again to use cart.");
  }

  // Make sure product is not null before rendering
  if (product === null) {
    if (!isFoundProduct) {
      return (
        <Container className="text-center py-5">
          <h1>Product not found</h1>
        </Container>
      );
    }
    return "";
  }

  return (
    <Container fluid className="py-5 px-md-5">
      <Row className="justify-content-center">
        <Col className="mb-3" xs={12} md={6}>
          <Image
            fluid
            rounded
            className="product-img shadow"
            src={product.img_url}
          />
        </Col>
        <Col xs={12} md={6}>
          <p className="category-tag">
            {product.category}
            {product.subcategory !== "" ? ` | ${product.subcategory}` : ""}
          </p>
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
                <Col>
                  {product.weight.toFixed(1)} lb
                  {product.weight !== 1 ? "s" : ""}
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>{product.inventory} in stock</Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <Button
                    className="button-round"
                    onClick={() => handleOnClickQuantity(quantity - 1)}
                    disabled={product.inventory === 0 || cartID !== -1}
                  >
                    -
                  </Button>
                  <Form.Control
                    className="quantity-input mx-3"
                    type="text"
                    value={quantity}
                    onChange={handleOnChangeQuantity}
                    disabled={product.inventory === 0 || cartID !== -1}
                  />
                  <Button
                    className="button-round"
                    onClick={() => handleOnClickQuantity(quantity + 1)}
                    disabled={product.inventory === 0 || cartID !== -1}
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
            disabled={
              isCartButtonDisabled || (product.inventory === 0 && cartID === -1)
            } // Always allow remove from cart
          >
            {cartID === -1 ? "Add to cart" : "Remove from cart"}
          </Button>
        </Col>
      </Row>
      {similar.length > 0 && (
        <React.Fragment>
          <Row className="my-4">
            <Col>
              <hr />
              <h4 className="text-center">Similar Products</h4>
              <hr />
            </Col>
          </Row>
          <Row className="justify-content-center">
            {similar.map((similarProduct) => (
              <ProductBox product={similarProduct} key={similarProduct.id} />
            ))}
          </Row>
        </React.Fragment>
      )}
    </Container>
  );
}

export default Product;
