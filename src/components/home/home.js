import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCategory } from "../../actions/products-actions";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Carousel from "react-bootstrap/Carousel";
import HomeCategory from "./home-category";

const CAROUSEL_INTERVAL = 2000;

function Home() {
  const [index, setIndex] = useState(0);
  const dispatch = useDispatch();

  return (
    <Container fluid className="pb-5 px-md-5">
      <Row>
        <Col>
          <Carousel
            activeIndex={index}
            onSelect={(selectedIndex) => setIndex(selectedIndex)}
            interval={CAROUSEL_INTERVAL}
            pause={false}
          >
            <Carousel.Item>
              <Link
                to="/products"
                onClick={() => dispatch(setCategory("Furniture"))}
              >
                <img
                  className="d-block w-100"
                  src="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"
                  alt="First slide"
                />
                <Carousel.Caption>
                  <h3>Thanksgiving Sale!</h3>
                  <p>Furniture, such as chairs and desks, as low as $9.99!</p>
                </Carousel.Caption>
              </Link>
            </Carousel.Item>
            <Carousel.Item>
              <Link
                to="/products"
                onClick={() => dispatch(setCategory("Computer Accessories"))}
              >
                <img
                  className="d-block w-100"
                  src="https://res.cloudinary.com/osd/image/upload/v1602180156/samples/ecommerce/leather-bag-gray.jpg"
                  alt="Second slide"
                />
                <Carousel.Caption>
                  <h3>Cyber Monday Sale!</h3>
                  <p>
                    Computer accessories, such as mice and monitors, as low as
                    $4.99!
                  </p>
                </Carousel.Caption>
              </Link>
            </Carousel.Item>
            <Carousel.Item>
              <Link
                to="/products"
                onClick={() => dispatch(setCategory("School Supplies"))}
              >
                <img
                  className="d-block w-100"
                  src="https://res.cloudinary.com/osd/image/upload/v1602180087/samples/ecommerce/analog-classic.jpg"
                  alt="Third slide"
                />
                <Carousel.Caption>
                  <h3>Back to School Sale!</h3>
                  <p>
                    School supplies, such as pencils, pens, and paper, as low as
                    $0.99!
                  </p>
                </Carousel.Caption>
              </Link>
            </Carousel.Item>
          </Carousel>
          <Row className="my-4">
            <Col>
              <hr />
              <h1 className="text-center">Popular Categories</h1>
              <hr />
            </Col>
          </Row>

          <Row className="justify-content-center text-center">
            <HomeCategory
              categoryName="Office Supplies"
              imgSrc="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"
            />
            <HomeCategory
              categoryName="Furniture"
              imgSrc="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"
            />
            <HomeCategory
              categoryName="Cleaning"
              imgSrc="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"
            />
            <HomeCategory
              categoryName="Computer Accessories"
              imgSrc="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"
            />
            <HomeCategory
              categoryName="Electronics"
              imgSrc="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"
            />
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
