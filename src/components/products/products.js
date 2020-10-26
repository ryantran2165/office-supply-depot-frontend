import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import { API_URL } from "../../App";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import PRODUCT_CATEGORIES from "../product-categories";

const ITEMS_PER_PAGE = 20;
const ROWS = 5;
const COLS = 4;

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      count: 0,
      page: 1,
    };
  }

  componentDidMount() {
    axios.get(`${API_URL}/products/`).then((res) => {
      this.setState({ products: res.data.products, count: res.data.count });
    });
  }

  componentDidUpdate() {}

  getProductSquares() {
    const productsGrid = [];

    for (let r = 0; r < ROWS; r++) {
      const cols = [];
      let outOfProducts = false;

      for (let c = 0; c < COLS; c++) {
        // Out of products
        if (r * COLS + c > this.state.products.length - 1) {
          outOfProducts = true;
          break;
        }

        // Add product column
        const product = this.state.products[r * COLS + c];
        cols.push(
          <Col key={product.name} xs={3}>
            <Image fluid rounded src={product.img_url} />
            <h5>{product.name}</h5>
            <h5>${product.price}</h5>
          </Col>
        );
      }

      // Cols may be empty because possibly out of products on start of new row
      if (cols.length !== 0) {
        productsGrid.push(
          <React.Fragment key={`row-${r}`}>
            {r > 0 && <hr />}
            <Row className="">{cols}</Row>
          </React.Fragment>
        );
      }

      // Out of products, done
      if (outOfProducts) {
        break;
      }
    }

    return productsGrid;
  }

  render() {
    const start = ITEMS_PER_PAGE * (this.state.page - 1) + 1;
    const end = ITEMS_PER_PAGE * this.state.page;

    return (
      <Container fluid>
        <Row className="mt-3 mb-3">
          <Col>
            <h5>
              {start}-{end} of {this.state.count} results
            </h5>
          </Col>
          <Col>{/* SORT MULTI-SELECT HERE */}</Col>
        </Row>
        <Row>
          <Col xs={3}>
            <Accordion>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} eventKey="0">
                    Category
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <ul>
                      {PRODUCT_CATEGORIES.map((productCategory) => (
                        <li key={productCategory[0]}>{productCategory[0]}</li>
                      ))}
                    </ul>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
          <Col>{this.getProductSquares()}</Col>
        </Row>
      </Container>
    );
  }
}

Products.propTypes = {
  query: PropTypes.string,
  category: PropTypes.string,
  subcategory: PropTypes.string,
};

const mapStateToProps = (state) => ({
  query: state.products.query,
  category: state.products.category,
  subcategory: state.products.subcategory,
});

export default connect(mapStateToProps)(Products);
