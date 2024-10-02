import { Component } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Cart from "./components/Cart";
import Order from "./components/Order";
import PageNotFound from "./components/PageNotFound";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import "./App.css";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/cart" component={Cart} />
          <ProtectedRoute exact path="/order" component={Order} />
          <ProtectedRoute exact path="/not-found" component={PageNotFound} />
          <Redirect to="/not-found" />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
