import { Component } from "react";
import Cookies from "js-cookie";
import { withRouter, Redirect, Link } from "react-router-dom";
import "./index.css";

class Register extends Component {
  state = {
    username: "",
    password: "",
    name: "",
    email: "",
  };

  handleInputChange = (e) => {
    console.log(e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  };

  handleRegister = async (e) => {
    e.preventDefault();
    const { username, password, name, email } = this.state;
    const userDetails = { username, password, name, email };
    console.log(username);
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userDetails),
    });

    if (response.ok) {
      this.props.history.replace("/login");
      alert("Register Successfully!");
    } else {
      alert("Invalid Register");
    }
  };

  render() {
    const jwtToken = Cookies.get("jwt_token");
    if (jwtToken !== undefined) {
      return <Redirect to="/" />;
    }
    return (
      <div class="Register-container">
        <form class="form-container" onSubmit={this.handleRegister}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
            class="login-website-logo-desktop-img"
            alt="website logo"
          />
          <div class="input-container">
            <label class="input-label" htmlFor="username">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={this.handleInputChange}
              value={this.state.name}
              required
              className="input-field"
            />
          </div>
          <div class="input-container">
            <label class="input-label" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              onChange={this.handleInputChange}
              value={this.state.username}
              required
              className="input-field"
            />
          </div>
          <div class="input-container">
            <label class="input-label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              onChange={this.handleInputChange}
              value={this.state.password}
              required
              className="input-field"
            />
          </div>
          <div class="input-container">
            <label class="input-label" htmlFor="Email">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={this.handleInputChange}
              value={this.state.email}
              className="input-field"
              required
            />
          </div>
          <button type="submit" class="login-button">
            SignUp
          </button>
          <p className="or-para">or</p>
          <Link to="/login" className="link">
            <button type="button" class="login-button">
              Login
            </button>
          </Link>
        </form>
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
          class="login-website-logo-mobile-img"
          alt="website logo"
        />
      </div>
    );
  }
}

export default withRouter(Register);
