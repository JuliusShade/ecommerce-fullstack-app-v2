import React from "react";
import { useHistory } from "react-router-dom";
import logoutImage from "./pics/logout.png";
import checkoutImage from "./pics/checklist.png";
import "./Header.css";

const Header = ({ name, logout }) => {
  const history = useHistory();

  const handleCheckout = () => {
    history.push("/order");
  };

  return (
    <header className="header-container">
      <button className="logout-button" onClick={logout}>
        <img src={logoutImage} alt="Logout" className="logout-image" />
      </button>
      <h3 className="welcome-message">Welcome, {name}</h3>
      <h1 className="header-title">X-Fitness</h1>
      <button className="checkout-button" onClick={handleCheckout}>
        <img src={checkoutImage} alt="Checkout" className="checkout-image" />
      </button>
    </header>
  );
};

export default Header;
