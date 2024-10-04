import React, { Component } from "react";
import Cookies from "js-cookie";
import { withRouter } from "react-router-dom";
import Header from "../Header";
import "./index.css";

class Profile extends Component {
  state = {
    userId: "",
    name: "",
    email: "",
    username: "",
  };

  componentDidMount() {
    this.fetchProfileData();
  }

  fetchProfileData = async () => {
    const jwtToken = Cookies.get("jwt_token");
    const userId = Cookies.get("user_id");
    if (jwtToken === undefined) {
      this.props.history.push("/login");
    }

    const response = await fetch(`http://localhost:3000/users/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      this.setState({
        name: data.name,
        email: data.email,
        username: data.username,
      });
    } else {
      this.setState({ error: "Failed to fetch user data" });
    }
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleProfileUpdate = async (e) => {
    e.preventDefault();
    const { name, email, username } = this.state;

    const jwtToken = Cookies.get("jwt_token");
    const userId = Cookies.get("user_id");

    const response = await fetch(`http://localhost:3000/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({ name, email, username }),
    });

    if (response.ok) {
      alert("Profile updated successfully");
    } else {
      alert("Failed to update profile");
    }
  };

  removeUser = async () => {
    const jwtToken = Cookies.get("jwt_token");
    const userId = Cookies.get("user_id");

    const response = await fetch(`http://localhost:3000/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (response.ok) {
      Cookies.remove("jwt_token");
      this.props.history.replace("/login");
    } else {
      alert("Failed to update profile");
    }
  };

  render() {
    const { name, email, username } = this.state;

    return (
      <>
        <Header />
        <div className="profile-bg-container">
          <h1>User Profile</h1>
          <form onSubmit={this.handleProfileUpdate}>
            <div>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                value={username}
                onChange={this.handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={this.handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <button type="submit">Save</button>
            <br />
            <button type="button" onClick={this.removeUser}>
              Delete Profile
            </button>
          </form>
        </div>
      </>
    );
  }
}

export default withRouter(Profile);
