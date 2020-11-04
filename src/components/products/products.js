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
import Pagination from "react-bootstrap/Pagination";
import PRODUCT_CATEGORIES from "../product-categories";
import ProductBox from "./product-box";

const ITEMS_PER_PAGE = 20;

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

  componentDidUpdate(prevProps) {
    // Changed query, category, or subcategory
    if (
      prevProps.query !== this.props.query ||
      prevProps.category !== this.props.category ||
      prevProps.subcategory !== this.props.subcategory
    ) {
      this.getProducts();
    }
  }

  getProducts = () => {
    let queryParams = `?items=${ITEMS_PER_PAGE}&page=${this.state.page}`;
    if (this.props.query !== "") {
      queryParams += `&query=${this.props.query}`;
    }
    if (this.props.category !== "") {
      queryParams += `&category=${this.props.category}`;
    }
    if (this.props.subcategory !== "") {
      queryParams += `&subcategory=${this.props.subcategory}`;
    }

    axios.get(`${API_URL}/products/${queryParams}`).then((res) => {
      this.setState({ products: res.data.products, count: res.data.count });
    });
  };

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
      <Container fluid className="pb-5 px-md-5">
        <Row className="my-3">
          <Col>
            <h5>
              Showing {this.state.count} results{" "}
              {this.props.query !== "" ? `for "${this.props.query}"` : ""}
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
          <Col>
            <Row>
              {this.state.products.map((product) => {
                return <ProductBox product={product} key={product.id} />;
              })}
            </Row>
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
