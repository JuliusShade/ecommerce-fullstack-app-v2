import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import "./App.css";

import { Login } from "./components/Login/login";
import Dashboard from "./components/Dashboard/Dashboard";
import Register from "./components/Register/Register";
import Order from "./components/Order/order";
import Confirmation from "./components/Confirmation/confirmation";
import OrderHistory from "./components/OrderHistory/orderHistory";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  async function isAuth() {
    try {
      const response = await fetch(
        `http://${process.env.HOST_NAME}/api/v1/auth/is-verify`,
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );

      const parseRes = await response.json();

      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
      setLoading(false);
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    isAuth();
  }, []); // Pass an empty dependency array to run the effect only once on mount

  if (loading) {
    // Optional: You can add a loading spinner or any other loading indicator
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route
            exact
            path="/login"
            render={(props) =>
              !isAuthenticated ? (
                <Login {...props} setAuth={setAuth} />
              ) : (
                <Redirect to="/dashboard" />
              )
            }
          />
          <Route
            exact
            path="/register"
            render={(props) =>
              !isAuthenticated ? (
                <Register {...props} setAuth={setAuth} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            exact
            path="/dashboard"
            render={(props) =>
              isAuthenticated ? (
                <Dashboard {...props} setAuth={setAuth} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            exact
            path="/order"
            render={(props) =>
              isAuthenticated ? (
                <Order {...props} setAuth={setAuth} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            exact
            path="/confirmation/:orderId"
            render={(props) =>
              isAuthenticated ? (
                <Confirmation {...props} setAuth={setAuth} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            exact
            path="/order-history"
            render={(props) =>
              isAuthenticated ? (
                <OrderHistory {...props} setAuth={setAuth} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          {/* Add a default route in case none of the above matches */}
          <Redirect to="/login" />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
