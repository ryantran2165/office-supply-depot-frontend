import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class Products extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <h1>PRODUCTS: {this.props.query}</h1>;
  }
}

Products.propTypes = {
  query: PropTypes.string,
};

const mapStateToProps = (state) => ({
  query: state.products.query,
});

export default connect(mapStateToProps)(Products);
