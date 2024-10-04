import Cookies from "js-cookie";
import { withRouter, Link } from "react-router-dom";
import { IoBag } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import "./index.css";

const Header = (props) => {
  const onLogout = () => {
    const { history } = props;
    Cookies.remove("jwt_token");
    history.replace("/login");
  };
  const cartCount = localStorage.getItem("cart_count");
  return (
    <nav className="nav-header">
      <div className="nav-content">
        <div className="nav-bar-mobile-logo-container">
          <img
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
            alt="website logo"
          />

          <button type="button" className="nav-mobile-btn" onClick={onLogout}>
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-log-out-img.png"
              alt="nav logout"
              className="nav-bar-img"
            />
          </button>
        </div>

        <div className="nav-content nav-bar-large-container">
          <img
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
            alt="website logo"
          />
          <ul className="nav-menu">
            <Link className="remove-line" to="/">
              <li className="nav-menu-item">Home</li>
            </Link>
            <Link className="remove-line" to="/products">
              <li className="nav-menu-item">Products</li>
            </Link>
            <Link className="remove-line" to="/cart">
              <li className="nav-menu-item">
                Cart<span className="cart-count">{cartCount}</span>
              </li>
            </Link>
            <Link className="remove-line" to="/order">
              <li className="nav-menu-item">Orders</li>
            </Link>
          </ul>
          <button
            type="button"
            className="logout-desktop-btn"
            onClick={onLogout}
          >
            <MdOutlineLogout /> Logout
          </button>
        </div>
      </div>
      <div className="nav-menu-mobile">
        <ul className="nav-menu-list-mobile">
          <Link className="remove-line" to="/">
            <li className="nav-menu-item-mobile">
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-home-icon.png"
                alt="nav home"
                className="nav-bar-img"
              />
            </li>
          </Link>
          <Link className="remove-line" to="/products">
            <li className="nav-menu-item-mobile">
              <IoBag className="nav-bag-img" />
            </li>
          </Link>
          <Link className="remove-line" to="/cart">
            <li className="nav-menu-item-mobile">
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-cart-icon.png"
                alt="nav cart"
                className="nav-bar-img"
              />
              <span className="cart-count">{cartCount}</span>
            </li>
          </Link>
          <Link className="remove-line" to="/order">
            <li className="nav-menu-item-mobile">
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-products-icon.png"
                alt="nav products"
                className="nav-bar-img"
              />
            </li>
          </Link>
        </ul>
      </div>
    </nav>
  );
};
export default withRouter(Header);
