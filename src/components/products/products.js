import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
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
import Pagination from "react-bootstrap/Pagination";
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
    this.getProducts();
  }

  componentDidUpdate() {}

  getProducts = () => {
    axios
      .get(
        `${API_URL}/products/?items=${ITEMS_PER_PAGE}&page=${this.state.page}`
      )
      .then((res) => {
        this.setState({ products: res.data.products, count: res.data.count });
      });
  };

  getGrid() {
    const grid = [];

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
            <Link to={`/products/${product.id}`}>
              <Image fluid rounded src={product.img_url} />
              <h5>{product.name}</h5>
              <h5>${product.price}</h5>
            </Link>
          </Col>
        );
      }

      // Cols may be empty because possibly out of products on start of new row
      if (cols.length !== 0) {
        grid.push(
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

    return grid;
  }

  getPagination() {
    const lastPage = Math.ceil(this.state.count / ITEMS_PER_PAGE);
    const buttons = [];

    // First page always
    buttons.push(
      <Pagination.Item
        active={this.state.page === 1}
        onClick={() => this.setPage(1)}
        key={`page-${1}`}
      >
        1
      </Pagination.Item>
    );

    // Three to five pages
    if (lastPage >= 3 && lastPage <= 5) {
      // At least three pages
      buttons.push(
        <Pagination.Item
          active={this.state.page === 2}
          onClick={() => this.setPage(2)}
          key={`page-${2}`}
        >
          2
        </Pagination.Item>
      );
      if (lastPage >= 4) {
        // At least four pages
        buttons.push(
          <Pagination.Item
            active={this.state.page === 3}
            onClick={() => this.setPage(3)}
            key={`page-${3}`}
          >
            3
          </Pagination.Item>
        );

        if (lastPage === 5) {
          // Five pages
          buttons.push(
            <Pagination.Item
              active={this.state.page === 4}
              onClick={() => this.setPage(4)}
              key={`page-${4}`}
            >
              4
            </Pagination.Item>
          );
        }
      }
    } else if (lastPage > 5) {
      if (this.state.page === 1 || this.state.page === lastPage) {
        // First or last page active, ellipsis only
        buttons.push(<Pagination.Ellipsis disabled key={`ellipsis`} />);
      } else if (this.state.page === 2) {
        // Second page active, ellipsis after
        buttons.push(
          <Pagination.Item active key={`page-${2}`}>
            2
          </Pagination.Item>
        );
        buttons.push(<Pagination.Ellipsis disabled key={`ellipsis`} />);
      } else if (this.state.page === lastPage - 1) {
        // Second to last page active, ellipsis before
        buttons.push(<Pagination.Ellipsis disabled key={`ellipsis`} />);
        buttons.push(
          <Pagination.Item active key={`page-${lastPage - 1}`}>
            {lastPage - 1}
          </Pagination.Item>
        );
      } else if (this.state.page === 3) {
        // Third page active, second and third page always, ellipsis after
        buttons.push(
          <Pagination.Item onClick={() => this.setPage(2)} key={`page-${2}`}>
            2
          </Pagination.Item>
        );
        buttons.push(
          <Pagination.Item active key={`page-${3}`}>
            3
          </Pagination.Item>
        );
        buttons.push(<Pagination.Ellipsis disabled key={`ellipsis`} />);
      } else if (this.state.page === lastPage - 2) {
        // Third to last page active, third and second to last pages always, ellipsis before
        buttons.push(<Pagination.Ellipsis disabled key={`ellipsis`} />);
        buttons.push(
          <Pagination.Item active key={`page-${lastPage - 2}`}>
            {lastPage - 2}
          </Pagination.Item>
        );
        buttons.push(
          <Pagination.Item
            onClick={() => this.setPage(lastPage - 1)}
            key={`page-${lastPage - 1}`}
          >
            {lastPage - 1}
          </Pagination.Item>
        );
      } else {
        // Some page in the middle active, ellipse before and after
        buttons.push(<Pagination.Ellipsis disabled key={`ellipsis-before`} />);
        buttons.push(
          <Pagination.Item active key={`page-${this.state.page}`}>
            {this.state.page}
          </Pagination.Item>
        );
        buttons.push(<Pagination.Ellipsis disabled key={`ellipsis-after`} />);
      }
    }

    // Last page if exists
    if (lastPage > 1) {
      buttons.push(
        <Pagination.Item
          active={this.state.page === lastPage}
          onClick={() => this.setPage(lastPage)}
          key={`page-${lastPage}`}
        >
          {lastPage}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="mt-3 justify-content-center">
        <Pagination.First onClick={() => this.setPage(1)} />
        <Pagination.Prev onClick={() => this.setPage(this.state.page - 1)} />
        {buttons}
        <Pagination.Next onClick={() => this.setPage(this.state.page + 1)} />
        <Pagination.Last onClick={() => this.setPage(lastPage)} />
      </Pagination>
    );
  }

  setPage = (page) => {
    const lastPage = Math.ceil(this.state.count / ITEMS_PER_PAGE);
    if (page < 1) {
      page = 1;
    } else if (page > lastPage) {
      page = lastPage;
    }
    this.setState({ page }, this.getProducts);
  };

  render() {
    return (
      <Container fluid className="pb-5">
        <Row className="mt-3 mb-3">
          <Col>
            <h5>Showing {this.state.count} results</h5>
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
          <Col>
            {this.getGrid()}
            {this.getPagination()}
          </Col>
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
