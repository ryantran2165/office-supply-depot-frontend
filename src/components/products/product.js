import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../App";
import Container from "react-bootstrap/Container";
import { Col, Row, Image, Button } from "react-bootstrap";

function Product() {
  // State
  let { id } = useParams();
  const [product, setProduct] = useState(null);

  // On mount, get product details from backend
  useEffect(() => {
    axios.get(`${API_URL}/products/${id}`).then((res) => {
      setProduct(res.data);
    });
    console.log(product);
  }, [id]);
  
  // Make sure product is not null before rendering
  return (
    <Container fluid className="pb-5">
      {product ? (
        <div>
          <Row className="pt-5 justtify-content-center ml-5">
            <Col>
              <Image className="product-image" fluid src={product.img_url}/>
            </Col>
            <Col className="ml-3">
              <h2>{product.name}</h2>
              <p className="product-description mt-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna 
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
                ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis 
                aute irure dolor in reprehenderit in voluptate velit esse 
                cillum dolore eu fugiat nulla pariatur. Excepteur sint 
                occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.</p>
              <h4 className="mt-3">${product.price}</h4>
              <form className="mt-3" method="post">
                <div>
                  <Row>
                    <label className="qty-label pl-3 mr-3 mt-1">Quantity</label>
                    <Button className="button-round mr-2">-</Button>
                    <input className="quantity-input" type="text" value="1"/>
                    <Button className="button-round ml-2">+</Button>
                    <Button className="add-to-cart-button ml-3" type="submit" value="Add to cart">Add to cart</Button>
                  </Row>
                </div>
              </form>
            </Col>
            </Row>
            <h4 className="ml-5 pl-3 mt-5">More from categories</h4>
            <Row className="justify-content-center w-80 m-5">
              <Col>
              <Image className="product-image" fluid src="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"/>
              </Col>
              <Col>
              <Image className="product-image" fluid src="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"/>
              </Col>
              <Col>
              <Image className="product-image" fluid src="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"/>
              </Col>
              <Col>
              <Image className="product-image" fluid src="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"/>
              </Col>
              <Col>
              <Image className="product-image" fluid src="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"/>
              </Col>
            
          </Row>
        </div>
       
      ): ""}
    </Container>
  );


  
}

export default Product;
