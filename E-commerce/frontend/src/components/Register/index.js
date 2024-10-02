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
      alert("Register Successfully!");
      this.props.history.replace("/login");
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
      <div className="register-container">
        <form onSubmit={this.handleRegister} className="register-form">
          <h1>Register</h1>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={this.handleInputChange}
            value={this.state.name}
            required
            className="register-input"
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={this.handleInputChange}
            value={this.state.username}
            required
            className="register-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={this.handleInputChange}
            value={this.state.password}
            required
            className="register-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={this.handleInputChange}
            value={this.state.email}
            className="register-input"
            required
          />
          <button
            type="submit"
            className="register-button"
            onClick={this.handleRegister}
          >
            Register
          </button>
          <a href="/login" className="login-btn">
            Login
          </a>
        </form>
      </div>
    );
  }
}

export default withRouter(Register);
