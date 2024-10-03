import { Component } from "react";
import Cookies from "js-cookie";
import { withRouter, Redirect } from "react-router-dom";
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

    const response = await fetch("http://localhost:3010/login", {
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
      <div className="login-container">
        <form onSubmit={this.handleLogin} className="login-form">
          <h1>Login</h1>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={this.state.username}
            onChange={this.handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleInputChange}
            required
          />
          <button type="submit">Login</button>
          <a href="/register" className="register-btn">
            Register
          </a>
        </form>
      </div>
    );
  }
}

export default withRouter(Login);
