import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Carousel from "react-bootstrap/Carousel";
import HomeCategory from "./home-category";

function Home() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <Container fluid className="pb-5">
      <Row>
        <Col>
          <Carousel
            activeIndex={index}
            onSelect={handleSelect}
            interval={2000}
            pause={false}
          >
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"
                alt="First slide"
              />
              <Carousel.Caption>
                <h3>First slide label</h3>
                <p>
                  Nulla vitae elit libero, a pharetra augue mollis interdum.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://res.cloudinary.com/osd/image/upload/v1602180156/samples/ecommerce/leather-bag-gray.jpg"
                alt="Second slide"
              />

              <Carousel.Caption>
                <h3>Second slide label</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://res.cloudinary.com/osd/image/upload/v1602180087/samples/ecommerce/analog-classic.jpg"
                alt="Third slide"
              />

              <Carousel.Caption>
                <h3>Third slide label</h3>
                <p>
                  Praesent commodo cursus magna, vel scelerisque nisl
                  consectetur.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
          <h1 className="text-center mt-3 mb-3">Popular Categories</h1>
          <Row className="justify-content-center text-center">
            <HomeCategory
              categoryName="Category 1"
              imgSrc="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"
            />
            <HomeCategory
              categoryName="Category 2"
              imgSrc="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"
            />
            <HomeCategory
              categoryName="Category 3"
              imgSrc="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"
            />
            <HomeCategory
              categoryName="Category 4"
              imgSrc="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"
            />
            <HomeCategory
              categoryName="Category 5"
              imgSrc="https://res.cloudinary.com/osd/image/upload/v1602180165/samples/ecommerce/accessories-bag.jpg"
            />
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
