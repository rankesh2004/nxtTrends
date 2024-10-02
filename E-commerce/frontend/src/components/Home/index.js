import { Component } from "react";
import Cookies from "js-cookie";
import Header from "../Header";
import { AiOutlinePlusSquare, AiOutlineMinusSquare } from "react-icons/ai";
import "./index.css";

class Home extends Component {
  state = {
    products: [],
    quantity: 1,
  };

  componentDidMount() {
    this.fetchProducts();
  }

  fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3000/products");
      const data = await response.json();
      this.setState({ products: data });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  addToCart = async (product_id) => {
    const token = Cookies.get("jwt_token");
    const { quantity } = this.state;
    try {
      const response = await fetch("http://localhost:3000/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id, quantity }),
      });
      if (response.ok) {
        alert("Product added to cart");
      } else {
        alert("Error adding product to cart");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  decrementQuantity = () => {
    const { quantity } = this.state;
    if (quantity > 0) {
      this.setState((prevState) => ({
        quantity: prevState.quantity - 1,
      }));
    }
  };

  incrementQuantity = () => {
    this.setState((prevState) => ({
      quantity: prevState.quantity + 1,
    }));
  };

  render() {
    const { products, quantity } = this.state;

    return (
      <div className="home-container">
        <Header />
        <div className="all-products-container">
          <h1>All Products</h1>
          <ul className="products-list">
            {products.map((product) => (
              <li className="product-item">
                <img
                  src={product.image_url}
                  alt="product"
                  className="thumbnail"
                />
                <h1 className="title">{product.title}</h1>
                <p className="brand">by {product.brand}</p>
                <div className="product-details">
                  <p className="price">Rs {product.price}/-</p>
                  <div className="rating-container">
                    <p className="rating">{product.rating}</p>
                    <img
                      src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                      alt="star"
                      className="star"
                    />
                  </div>
                </div>
                <div className="increment-decrement-container">
                  <AiOutlineMinusSquare
                    className="cart-item-quantity-icon"
                    onClick={this.decrementQuantity}
                  />
                  <h4 className="cart-item-quantity">{quantity}</h4>
                  <AiOutlinePlusSquare
                    className="cart-item-quantity-icon"
                    onClick={this.incrementQuantity}
                  />
                </div>
                <button
                  onClick={() => this.addToCart(product.product_id)}
                  className="add-cart"
                >
                  Add to Cart
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Home;
