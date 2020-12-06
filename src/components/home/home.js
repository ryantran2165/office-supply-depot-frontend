import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCategory } from "../../actions/products-actions";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Carousel from "react-bootstrap/Carousel";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import HomeCategory from "./home-category";
import { GOOGLE_MAPS_API_KEY } from "../../App";

const containerStyle = {
  width: "100%",
  height: "400px",
};
const location1 = {
  lat: 37.335241,
  lng: -121.881074,
};
const location2 = {
  lat: 37.337894,
  lng: -121.884938,
};

const CAROUSEL_INTERVAL = 2000;

function Home() {
  const [index, setIndex] = useState(0);
  const dispatch = useDispatch();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

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
                onClick={() => dispatch(setCategory("Office Supplies"))}
              >
                <img
                  className="d-block w-100"
                  src="https://res.cloudinary.com/osd/image/upload/v1606000627/Office%20Supply%20Depot/thanksgiving_l1a2fm.jpg"
                  alt="Thanksgiving"
                />
                <Carousel.Caption>
                  <div className="carousel-caption-background p-1">
                    <h3>Thanksgiving Sale!</h3>
                    <p>
                      Office supplies, such as pens, folders and binders, as low
                      as $1.99!
                    </p>
                  </div>
                </Carousel.Caption>
              </Link>
            </Carousel.Item>
            <Carousel.Item>
              <Link
                to="/products"
                onClick={() => dispatch(setCategory("Furniture"))}
              >
                <img
                  className="d-block w-100"
                  src="https://res.cloudinary.com/osd/image/upload/v1606000700/Office%20Supply%20Depot/black-friday_j4zxew.jpg"
                  alt="Black Friday"
                />
                <Carousel.Caption>
                  <div className="carousel-caption-background p-1">
                    <h3>Black Friday Sale!</h3>
                    <p>
                      Furniture, such as chairs, desks and tables, as low as
                      $29.99!
                    </p>
                  </div>
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
                  src="https://res.cloudinary.com/osd/image/upload/v1606000743/Office%20Supply%20Depot/cyber-monday_sqcjlj.png"
                  alt="Cyber Monday"
                />
                <Carousel.Caption>
                  <div className="carousel-caption-background p-1">
                    <h3>Cyber Monday Sale!</h3>
                    <p>
                      Computer accessories, such as computers and software, as
                      low as $19.99!
                    </p>
                  </div>
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
              imgSrc="https://res.cloudinary.com/osd/image/upload/v1606000827/Office%20Supply%20Depot/office-supplies_wjsrie.jpg"
            />
            <HomeCategory
              categoryName="Furniture"
              imgSrc="https://res.cloudinary.com/osd/image/upload/v1606001030/Office%20Supply%20Depot/furniture_er381f.jpg"
            />
            <HomeCategory
              categoryName="Cleaning"
              imgSrc="https://res.cloudinary.com/osd/image/upload/v1606000879/Office%20Supply%20Depot/cleaning_lm6cj5.jpg"
            />
            <HomeCategory
              categoryName="Computer Accessories"
              imgSrc="https://res.cloudinary.com/osd/image/upload/v1606001035/Office%20Supply%20Depot/computer-accessories_kzy3wi.jpg"
            />
            <HomeCategory
              categoryName="Electronics"
              imgSrc="https://res.cloudinary.com/osd/image/upload/v1606001151/Office%20Supply%20Depot/electronics_fhik8d.jpg"
            />
          </Row>
          <Row className="my-4">
            <Col>
              <hr />
              <h1 className="text-center">Locations</h1>
              <hr />
            </Col>
          </Row>
          <Row className="justify-content-center text-center">
            <Col className="mb-4" xs={12} sm={6}>
              <h3>
                Location #1:
                <br />
                1 Washington Sq
                <br />
                San Jose, CA 95192
              </h3>
            </Col>
            <Col className="mb-4" xs={12} sm={6}>
              <h3>
                Location #2:
                <br />
                200 E Santa Clara St
                <br />
                San Jose, CA 95113
              </h3>
            </Col>
          </Row>
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={location1}
              zoom={15}
            >
              <Marker position={location1} />
              <Marker position={location2} />
            </GoogleMap>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
