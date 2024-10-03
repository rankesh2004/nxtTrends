import { Component } from "react";
import Cookies from "js-cookie";
import Header from "../Header";
import { AiOutlinePlusSquare, AiOutlineMinusSquare } from "react-icons/ai";
import {BsSearch} from 'react-icons/bs'
import PuffLoader from "react-spinners/PuffLoader";
import "./index.css";

class Home extends Component {
  state = {
    products: [],
    quantity: 1,
    searchInput:""
  };

  componentDidMount() {
    this.fetchProducts();
  }

  fetchProducts = async () => {
    const jwt_token = Cookies.get("jwt_token")
    try {
      const response = await fetch("http://localhost:3010/products",{
        headers: {
          Authorization: `Bearer ${jwt_token}`,
        },
      });
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

  onSearchInput = (e) => {
    this.setState({searchInput: e.target.value})
  }

  renderLoader = () => {
    return (
      <div className="loader-box">
        <PuffLoader
          color="#F7931E"
          loading={true}
          size={100}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  };

  render() {
    const { products, quantity, searchInput } = this.state;
    const searchList = products.filter(eachItem => 
      eachItem.title.toLowerCase().includes(searchInput.toLowerCase())
    );

    return (
      <div className="home-container">
        <Header />
        <div className="all-products-container">
          <h1 className="home-heading">All Products</h1>
          <div className="search-input">
            <BsSearch className="search-icon"/>
            <input type="text" placeholder="Search" value={searchInput} onChange={this.onSearchInput}/>
          </div>
          <ul className="products-list">
            {searchList.map((product) => (
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
                <div className="quantity-add-conatiner">
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
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Home;
