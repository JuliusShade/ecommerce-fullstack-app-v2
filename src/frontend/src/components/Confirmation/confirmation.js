import React from "react";
import { useHistory, useParams } from "react-router-dom";
import "./confirmation.css";

const Confirmation = () => {
  const history = useHistory();
  const { orderId } = useParams();

  const handleBackToDashboard = () => {
    history.push("/dashboard"); // Replace with the actual route for your dashboard
  };

  return (
    <div className="confirmation-container">
      <h2>Order Confirmation</h2>
      <p>Your order (ID: {orderId}) has been successfully processed.</p>
      <button
        className="back-to-dashboard-button"
        onClick={handleBackToDashboard}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default Confirmation;
