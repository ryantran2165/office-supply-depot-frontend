import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../actions/auth-actions";
import axios from "axios";
import { API_URL } from "../../App";
import Container from "react-bootstrap/Container";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
// import Image from "react-bootstrap/Image";
// import Button from "react-bootstrap/Button";
// import Form from "react-bootstrap/Form";

class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: null,
    };
  }

  componentDidMount() {
    this.loadCart();
  }

  loadCart() {
    const header = {
      headers: {
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };
    axios
      .get(`${API_URL}/carts/`, header)
      .then((res) => {
        const cart = [];

        // To indicate that cart is loaded but empty
        if (res.data.length === 0) {
          this.setState({ cart });
        }

        // Replace product ids with actual products and add one at a time
        for (let item of res.data) {
          axios.get(`${API_URL}/products/${item.product}`).then((res) => {
            item.product = res.data;
            cart.push(item);
            this.setState({ cart: [...cart] });
          });
        }
      })
      .catch(() => {
        this.tokenExpired();
      });
  }

  tokenExpired() {
    this.props.signOut();
    alert("Your token expired.\nPlease sign in again to use checkout.");
  }

  handleOnChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    // Make sure cart is not null before rendering
    if (this.state.cart === null) {
      return "";
    }

    // Empty cart, go back to cart
    if (this.state.cart.length === 0) {
      this.props.history.push("/cart");
    }

    return (
      <Container fluid className="pb-5 px-md-5">
        CHECKOUT
      </Container>
    );
  }
}

export default connect(null, { signOut })(withRouter(Checkout));
