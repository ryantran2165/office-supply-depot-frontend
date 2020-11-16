import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setCategory, setSubcategory } from "../../actions/products-actions";
import axios from "axios";
import { API_URL } from "../../App";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Pagination from "react-bootstrap/Pagination";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import ProductBox from "./product-box";
import ProductFilter from "./product-filter";
import PRODUCT_CATEGORIES from "../product-categories";

const ITEMS_PER_PAGE = 20;
const PRICE_FILTERS = {
  "$25 & Under": {
    minPrice: 0,
    maxPrice: 25,
  },
  "$25 - $50": {
    minPrice: 25,
    maxPrice: 50,
  },
  "$50 - $100": {
    minPrice: 50,
    maxPrice: 100,
  },
  "$100 - $200": {
    minPrice: 100,
    maxPrice: 200,
  },
  "$200 & Above": {
    minPrice: 200,
    maxPrice: Infinity,
  },
};
const SORT_OPTIONS = [
  "Best Match",
  "Name A to Z",
  "Name Z to A",
  "Price Low to High",
  "Price High to Low",
];

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      count: 0,
      page: 1,
      priceFilter: "",
      minPrice: 0,
      maxPrice: Infinity,
      sort: SORT_OPTIONS[0],
    };
  }

  componentDidMount() {
    this.getProducts();
  }

  componentDidUpdate(prevProps, prevState) {
    // Different from previous props/state
    if (
      prevProps.query !== this.props.query ||
      prevProps.category !== this.props.category ||
      prevProps.subcategory !== this.props.subcategory ||
      prevState.page !== this.state.page ||
      prevState.priceFilter !== this.state.priceFilter ||
      prevState.sort !== this.state.sort
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
    if (this.state.minPrice !== 0) {
      queryParams += `&min_price=${this.state.minPrice}`;
    }
    if (this.state.maxPrice !== Infinity) {
      queryParams += `&max_price=${this.state.maxPrice}`;
    }
    if (this.props.query === "" && this.state.sort === SORT_OPTIONS[0]) {
      // No query and sort Best Match, do sort Name A to Z
      queryParams += `&sort=${SORT_OPTIONS[1]}`;
    } else {
      queryParams += `&sort=${this.state.sort}`;
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
      <Pagination className="justify-content-center mt-3">
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
    page = Math.max(page, 1);
    page = Math.min(page, lastPage);
    this.setState({ page });
  };

  handleOnChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const re = /^\d{0,3}$/;

    if (value === "") {
      this.setState({ [name]: name === "minPrice" ? 0 : Infinity });
    } else if (re.test(value)) {
      this.setState({ [name]: parseInt(value) });
    }
  };

  handleOnClickClear = () => {
    this.props.setCategory("");
    this.props.setSubcategory("");
    this.handleOnClickPrice("");
  };

  handleOnClickCategory = (category) => {
    if (category === this.props.category) {
      category = "";
    }
    this.props.setCategory(category);
    this.props.setSubcategory("");
  };

  handleOnClickSubcategory = (subcategory) => {
    if (subcategory === this.props.subcategory) {
      subcategory = "";
    }
    this.props.setSubcategory(subcategory);
  };

  handleOnClickPrice = (priceFilter) => {
    if (priceFilter === this.state.priceFilter) {
      priceFilter = "";
    }
    const minPrice =
      priceFilter === "" ? 0 : PRICE_FILTERS[priceFilter].minPrice;
    const maxPrice =
      priceFilter === "" ? Infinity : PRICE_FILTERS[priceFilter].maxPrice;
    this.setState({ priceFilter, minPrice, maxPrice });
  };

  handleOnSubmitPrice = (e) => {
    e.preventDefault();

    if (this.state.priceFilter === "") {
      // Need to manually fetch products
      this.getProducts();
    } else {
      // Products are fetched when priceFilter changes, so this will auto fetch
      this.setState({ priceFilter: "" });
    }
  };

  handleOnChangeSort = (e) => {
    this.setState({ sort: e.target.value });
  };

  render() {
    return (
      <Container fluid className="pb-5 px-md-5">
        <Row className="align-items-center my-3">
          <Col>
            <h5>
              Showing {this.state.count} results
              {this.props.query !== "" ? ` for "${this.props.query}"` : ""}
            </h5>
          </Col>
          <Col xs={12} sm="auto">
            <Form inline>
              <h5 className="mr-2">Sort:</h5>
              <Form.Control as="select" onChange={this.handleOnChangeSort}>
                {SORT_OPTIONS.map((option) => {
                  return <option key={option}>{option}</option>;
                })}
              </Form.Control>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col className="mb-3" xs={12} md="auto">
            <Row className="mb-2">
              <Col>
                <span
                  className="hover-pointer font-weight-bold"
                  onClick={this.handleOnClickClear}
                >
                  Clear filters
                </span>
              </Col>
            </Row>
            <ProductFilter
              title="Category"
              activeKey={this.props.category}
              links={Object.keys(PRODUCT_CATEGORIES)}
              onClickLink={this.handleOnClickCategory}
            />
            {PRODUCT_CATEGORIES[this.props.category] &&
              PRODUCT_CATEGORIES[this.props.category].length > 0 && (
                <ProductFilter
                  title="Subcategory"
                  activeKey={this.props.subcategory}
                  links={PRODUCT_CATEGORIES[this.props.category]}
                  onClickLink={this.handleOnClickSubcategory}
                />
              )}
            <ProductFilter
              title="Price"
              activeKey={this.state.priceFilter}
              links={Object.keys(PRICE_FILTERS)}
              onClickLink={this.handleOnClickPrice}
              customElement={
                <Form inline onSubmit={this.handleOnSubmitPrice}>
                  <InputGroup className="filter-input-group">
                    <InputGroup.Prepend>
                      <InputGroup.Text>$</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="text"
                      placeholder="Min"
                      name="minPrice"
                      value={
                        this.state.minPrice === 0 ? "" : this.state.minPrice
                      }
                      onChange={this.handleOnChange}
                    />
                  </InputGroup>
                  <InputGroup className="filter-input-group mx-1">
                    <InputGroup.Prepend>
                      <InputGroup.Text>$</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="text"
                      placeholder="Max"
                      name="maxPrice"
                      value={
                        this.state.maxPrice === Infinity
                          ? ""
                          : this.state.maxPrice
                      }
                      onChange={this.handleOnChange}
                    />
                  </InputGroup>
                  <Button type="submit">Go</Button>
                </Form>
              }
            />
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

export default connect(mapStateToProps, {
  setCategory,
  setSubcategory,
})(Products);
