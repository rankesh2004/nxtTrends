import { Component } from "react";
import Cookies from "js-cookie";
import Header from "../Header";
import { BiRupee } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import PuffLoader from "react-spinners/PuffLoader";
import "./index.css";

class Cart extends Component {
  state = {
    cartItems: [],
    isLoading: true,
    isFailure: false,
  };

  componentDidMount() {
    this.fetchCartItems();
  }

  fetchCartItems = async () => {
    const token = Cookies.get("jwt_token");
    try {
      const response = await fetch("http://localhost:3000/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      this.setState({ cartItems: data, isLoading: false });
    } catch (error) {
      this.setState({ isFailure: true });
    }
  };

  removeItem = async (productId) => {
    const token = Cookies.get("jwt_token");
    try {
      const response = await fetch(`http://localhost:3000/cart/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        alert("Item removed");
        this.setState({
          cartItems: this.state.cartItems.filter(
            (item) => item.product_id !== productId
          ),
        });
      } else {
        alert("Error removing item");
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  placeOrder = async () => {
    const { cartItems } = this.state;
    const token = Cookies.get("jwt_token");
    try {
      const response = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cartItems }),
      });
      if (response.ok) {
        localStorage.setItem("cart_count", 0);
        alert("Order placed successfully");
        this.props.history.replace("/order");
        this.setState({ cartItems: [] });
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
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
    const { cartItems, isFailure, isLoading } = this.state;
    let total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const cartCount = localStorage.setItem("cart_count", cartItems.length);
    return (
      <>
        {isFailure ? (
          this.renderFailureView()
        ) : (
          <>
            {isLoading ? (
              this.renderLoader()
            ) : (
              <div className="cart-container">
                <Header />
                <div className="cart-responsive-box">
                  {cartItems.length === 0 ? (
                    <div className="empty-cart-box">
                      <img
                        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-cart-icon.png"
                        alt="nav cart"
                        className="Empty-img"
                      />
                      <h1 className="no-orders-text">No Orders Yet!</h1>
                      <p className="cart-empty-text">
                        Your cart is empty. Add something from the menu.
                      </p>
                      <a href="/products">
                        <button className="order-btn">Order Now</button>
                      </a>
                    </div>
                  ) : (
                    <div className="cart-items-box">
                      <div className="t-header">
                        <h1 className="t-h-item">Item</h1>
                        <h1 className="t-h-item">Quantity</h1>
                        <h1 className="t-h-item">Price</h1>
                      </div>
                      <ul className="cart-items-list">
                        {cartItems.map((item) => (
                          <li className="cart-item" key={item.product_id}>
                            <div className="image-name-box">
                              <img
                                src={item.image_url}
                                alt="cart-img"
                                className="cart-item-image"
                              />
                              <div className="cart-item-details">
                                <h2 className="cart-item-name">{item.title}</h2>
                                <h5 className="cart-item-brand-name">
                                  by {item.brand}
                                </h5>
                              </div>
                            </div>
                            <div className="quantity-box">
                              <p className="cart-item-quantity">
                                {item.quantity}
                              </p>
                            </div>
                            <div className="cart-price-box">
                              <h1 className="cart-item-price">
                                <BiRupee /> {item.quantity * item.price}
                              </h1>
                            </div>
                            <div className="mob-view">
                              <p className="mob-cart-item-quantity">
                                Quantity: {item.quantity}
                              </p>
                              <h1 className="mob-cart-item-price">
                                <BiRupee />
                                {item.quantity * item.price}
                              </h1>
                              <MdDeleteOutline
                                className="mob-delete-icon"
                                onClick={() => this.removeItem(item.product_id)}
                              />
                            </div>
                            <MdDeleteOutline
                              className="delete-icon"
                              onClick={() => this.removeItem(item.product_id)}
                            />
                          </li>
                        ))}
                        <hr className="cart-items-line" />
                      </ul>
                      <div className="total-price-box">
                        <h1 className="order-total-text">Order Total:</h1>
                        <div className="box">
                          <h1 className="total-price">
                            <BiRupee /> {total}
                          </h1>
                        </div>
                      </div>
                      <div className="plaord-ref-btn-box">
                        <button
                          className="place-order-btn"
                          onClick={this.placeOrder}
                        >
                          Place Order
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </>
    );
  }
}

export default Cart;
