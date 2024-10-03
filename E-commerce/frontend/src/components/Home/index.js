import { Component } from "react";
import Cookies from "js-cookie";
import Header from "../Header";
import { AiOutlinePlusSquare, AiOutlineMinusSquare } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import PuffLoader from "react-spinners/PuffLoader";
import "./index.css";

class Home extends Component {
  state = {
    products: [],
    searchInput: "",
    isLoading: true,
    isFailure: false,
  };

  componentDidMount() {
    this.fetchProducts();
  }

  fetchProducts = async () => {
    const jwt_token = Cookies.get("jwt_token");
    try {
      const response = await fetch("http://localhost:3000/products", {
        headers: {
          Authorization: `Bearer ${jwt_token}`,
        },
      });
      const data = await response.json();

      // Initialize quantity for each product
      const updatedProducts = data.map((product) => ({
        ...product,
        quantity: 1, // default quantity
      }));

      this.setState({ products: updatedProducts, isLoading: false });
    } catch (error) {
      this.setState({ isFailure: true });
    }
  };

  addToCart = async (product_id) => {
    const token = Cookies.get("jwt_token");
    const { products } = this.state;
    const product = products.find((p) => p.product_id === product_id);
    const { quantity } = product; // get the specific product quantity

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

  decrementQuantity = (product_id) => {
    this.setState((prevState) => ({
      products: prevState.products.map((product) =>
        product.product_id === product_id && product.quantity > 1
          ? { ...product, quantity: product.quantity - 1 }
          : product
      ),
    }));
  };

  incrementQuantity = (product_id) => {
    this.setState((prevState) => ({
      products: prevState.products.map((product) =>
        product.product_id === product_id
          ? { ...product, quantity: product.quantity + 1 }
          : product
      ),
    }));
  };

  onSearchInput = (e) => {
    this.setState({ searchInput: e.target.value });
  };

  renderLoader = () => {
    return (
      <div className="loader-box">
        <PuffLoader
          color="#3b82f6"
          loading={true}
          size={100}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  };

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="all-products-error"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  );

  render() {
    const { products, searchInput, isLoading, isFailure } = this.state;
    const searchList = products.filter((eachItem) =>
      eachItem.title.toLowerCase().includes(searchInput.toLowerCase())
    );

    return (
      <>
        {isFailure ? (
          this.renderFailureView()
        ) : (
          <>
            {isLoading ? (
              this.renderLoader()
            ) : (
              <div className="home-container">
                <Header />
                <div className="all-products-container">
                  <h1 className="home-heading">All Products</h1>
                  <div className="search-input">
                    <BsSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchInput}
                      onChange={this.onSearchInput}
                    />
                  </div>
                  <ul className="products-list">
                    {searchList.map((product) => (
                      <li key={product.product_id} className="product-item">
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
                        <div className="quantity-add-container">
                          <div className="increment-decrement-container">
                            <AiOutlineMinusSquare
                              className="cart-item-quantity-icon"
                              onClick={() =>
                                this.decrementQuantity(product.product_id)
                              }
                            />
                            <h4 className="cart-item-quantity">
                              {product.quantity}
                            </h4>
                            <AiOutlinePlusSquare
                              className="cart-item-quantity-icon"
                              onClick={() =>
                                this.incrementQuantity(product.product_id)
                              }
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
            )}
          </>
        )}
      </>
    );
  }
}

export default Home;
