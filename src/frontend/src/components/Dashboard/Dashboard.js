// dashboard.js
import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import ItemList from "../ProductList/Item";
import { Cart } from "../Cart/cart";
import { googleLogout } from "@react-oauth/google";
import "./Dashboard.css";

const Dashboard = ({ setAuth }) => {
  const [name, setName] = useState("");

  async function getName() {
    try {
      const response = await fetch(
        `https://${process.env.HOST_NAME}/api/v1/dashboard`,
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );

      const parseRes = await response.json();

      setName(parseRes.firstname);
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    getName();
  }, []);

  const logout = async (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setAuth(false);
    googleLogout();
  };

  return (
    <div className="dashboard-container">
      <Header name={name} logout={logout} />
      <ItemList />
      {/* Add other components as needed */}
    </div>
  );
};

export default Dashboard;
