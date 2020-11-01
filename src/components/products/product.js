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
          <Row className="pt-5 justtify-content-center ml-5 pb-4 mb-4">
            <Col>
              <Image className="product-image" fluid src={product.img_url}/>
            </Col>
            <Col className="ml-3">
              <pre className="gray-text category-text-size">{product.category} | {product.subcategory}</pre>
              <h3>{product.name}</h3>
              <p className="product-description mt-3">{product.description}</p>
              <h4 className="mt-3 mb-3">${product.price}</h4>
              <span className="mt-3 product-detail">Weight&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{product.weight} lbs</span>
              <form className="mt-3" method="post">
                <div>
                  <Row>
                    <label className="product-detail pl-3 mr-3 mt-1">Quantity</label>
                    <Button className="button-round mr-2">-</Button>
                    <input className="quantity-input" type="text" value="1"/>
                    <Button className="button-round ml-2">+</Button>
                    <Button className="add-to-cart-button ml-4" type="submit" value="Add to cart">Add to cart</Button>
                  </Row>
                </div>
              </form>
            </Col>
            </Row>
            <hr/>
            <h4 className="text-center">More from categories</h4>
            <hr/>
            <p className="align mr-5">Page of </p>
            <div className="d-flex flex-row align-items-center">
              <div>
                <Button className="m-3 align-self-start button-round">+</Button>
              </div>
              <div>
              <Image className="p-3 product-image" fluid src="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"/>
              </div>
              <div>
                <Image className="p-3 product-image" fluid src="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"/>
              </div>
              <div>
                <Image className="p-3 product-image" fluid src="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"/>
              </div>
              <div>
                <Image className="p-3 product-image" fluid src="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"/>
              </div>
              <div>
                <Image className="p-3 product-image" fluid src="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"/>
              </div>
              <div>
                <Button className="m-3 align-self-start button-round">+</Button>
              </div>
            </div>
            
        </div>
       
      ): ""}
    </Container>
  );


  
}

export default Product;
