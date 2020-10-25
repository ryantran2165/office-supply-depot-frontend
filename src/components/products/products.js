import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class Products extends Component {
  render() {
    return (
      <div>
        <h1>PRODUCTS</h1>
        <h3>Query: {this.props.query}</h3>
        <h3>Category: {this.props.category}</h3>
        <h3>Subcategory: {this.props.subcategory}</h3>
      </div>
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
