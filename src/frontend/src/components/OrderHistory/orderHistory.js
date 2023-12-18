import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./orderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const history = useHistory();

  useEffect(() => {
    // Fetch orders when the component mounts
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Get the token from local storage
      const token = localStorage.getItem("token");

      // Decode the payload of the token
      const payload = token.split(".")[1];
      const decodedPayload = atob(payload);

      // Parse the payload as JSON to get user information
      const user = JSON.parse(decodedPayload);

      // Extract the user ID
      const userId = user.user.id;

      console.log("Fetching orders for user with ID:", userId);

      // Fetch orders for the user
      const response = await fetch(
        `http://localhost:3000/api/v1/orders/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const ordersData = await response.json();
        console.log("Fetched orders successfully:", ordersData);
        setOrders(ordersData);
      } else {
        console.error("Failed to fetch orders.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleBackToOrder = () => {
    history.push("/order");
  };

  return (
    <div className="order-history-wrapper">
      <h2 className="order-history-header">Order History</h2>

      <ul className="order-history-list">
        {orders.map((order) => (
          <li className="order-history-item" key={order.order_id}>
            Order ID: {order.order_id}, Total: ${order.total}
          </li>
        ))}
      </ul>
      <button onClick={handleBackToOrder} className="back-to-order-button">
        Back to Order
      </button>
    </div>
  );
};

export default OrderHistory;
