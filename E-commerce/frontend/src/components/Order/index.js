import { Component } from "react";
import Cookies from "js-cookie";
import Header from "../Header";
import { BiRupee } from "react-icons/bi";

class Orders extends Component {
  state = {
    orders: [],
  };

  componentDidMount() {
    this.fetchOrders();
  }

  fetchOrders = async () => {
    const token = Cookies.get("jwt_token");
    try {
      const response = await fetch("http://localhost:3000/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        this.setState({ orders: data });
      } else {
        console.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  render() {
    const { orders } = this.state;
    let total = orders.reduce((acc, item) => acc + item.price, 0);

    return (
      <div className="cart-container">
        <Header />
        <div className="cart-responsive-box">
          {orders.length === 0 ? (
            <div className="empty-cart-box">
              <h1 className="no-orders-text">No Orders Yet!</h1>
              <p className="cart-empty-text">
                Your order is empty. Add something from the menu.
              </p>
              <a href="/">
                <button className="order-btn">Order Now</button>
              </a>
            </div>
          ) : (
            <div className="cart-items-box">
              <div className="t-header">
                <h1 className="t-h-item">Item</h1>
                <h1 className="t-h-item">Price</h1>
              </div>
              <ul className="cart-items-list">
                {orders.map((item) => (
                  <li className="cart-item" key={item.product_id}>
                    <div className="image-name-box">
                      <img
                        src={item.image_url}
                        alt="cart-img"
                        className="cart-item-image"
                      />
                      <div className="cart-item-details">
                        <h2 className="cart-item-name">{item.title}</h2>
                      </div>
                    </div>
                    <div className="cart-price-box">
                      <h1 className="cart-item-price">
                        <BiRupee /> {item.price}
                      </h1>
                    </div>
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
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Orders;
