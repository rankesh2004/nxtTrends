import { Component } from "react";
import Cookies from "js-cookie";
import { withRouter, Redirect, Link } from "react-router-dom";
import "./index.css";

class Login extends Component {
  state = {
    username: "",
    password: "",
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleLogin = async (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    const { history } = this.props;

    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
      Cookies.set("jwt_token", data.jwtToken, { expires: 10 });
      history.replace("/");
      alert("Login successful");
    } else {
      alert(data.message || "Error");
    }
  };

  render() {
    const jwtToken = Cookies.get("jwt_token");
    if (jwtToken !== undefined) {
      return <Redirect to="/" />;
    }
    return (
      <div class="login-form-container">
        <form class="form-container" onSubmit={this.handleLogin}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
            class="login-website-logo-desktop-img"
            alt="website logo"
          />
          <div class="input-container">
            <label class="input-label" htmlFor="username">
              Username
            </label>
            <input
              class="input-field"
              type="text"
              name="username"
              placeholder="Username"
              value={this.state.username}
              onChange={this.handleInputChange}
              required
            />
          </div>
          <div class="input-container">
            <label class="input-label" htmlFor="password">
              Password
            </label>
            <input
              class="input-field"
              type="password"
              name="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.handleInputChange}
              required
            />
          </div>
          <button type="submit" class="login-button">
            Login
          </button>
          <p className="or-para">or</p>
          <Link to="/register" className="link">
            <button type="button" class="login-button">
              SignUp
            </button>
          </Link>
        </form>
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
          class="login-img"
          alt="website login"
        />
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
          class="login-website-logo-mobile-img"
          alt="website logo"
        />
      </div>
    );
  }
}

export default withRouter(Login);
