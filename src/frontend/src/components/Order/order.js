import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { fetchCartItems, refreshCart } from "../Cart/cart";
import homeImage from "./pics/home.png";
import "./order.css";

const Order = () => {
  const [cartItems, setCartItems] = useState([]);
  const history = useHistory();

  useEffect(() => {
    // Fetch cart items when the component mounts
    fetchCartItems(setCartItems);
  }, []);

  const calculateTotal = () => {
    // Create an object to store the quantity of each product
    const productQuantities = {};

    // Count the occurrences of each productid in the cartItems array
    cartItems.forEach((cartItem) => {
      const { productid } = cartItem;
      productQuantities[productid] = (productQuantities[productid] || 0) + 1;
    });

    // Calculate the total based on the quantity and price of each product
    const total = Object.keys(productQuantities).reduce((acc, productid) => {
      const quantity = productQuantities[productid];
      const product = cartItems.find(
        (item) => item.productid === parseInt(productid)
      );

      if (product) {
        return acc + quantity * product.price;
      }
      return acc;
    }, 0);

    return total;
  };

  const handleSubmitOrder = async () => {
    try {
      // Get the token from local storage
      const token = localStorage.getItem("token");

      // Decode the payload of the token
      const payload = token.split(".")[1];
      const decodedPayload = atob(payload);

      // Parse the payload as JSON to get user information
      const user = JSON.parse(decodedPayload);

      const decodedToken = JSON.parse(decodedPayload);
      // Extract the user ID
      const userId = decodedToken.user.id;

      // Calculate the total
      const total = calculateTotal();

      // Submit the order
      const orderResponse = await fetch("http://localhost:3000/api/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          total: total,
          status: true,
        }),
      });

      if (orderResponse.ok) {
        const orderData = await orderResponse.json();
        const orderId = orderData.order_id;

        // Delete cart items associated with the submitted order
        await deleteCartItems(cartItems);

        // Refresh the cart
        refreshCart({ setCartItems });

        // Redirect to the confirmation page with the order ID
        history.push(`/confirmation/${orderId}`);
      } else {
        console.error("Failed to submit the order.");
      }
    } catch (error) {
      console.error("Error submitting the order:", error);
    }
  };

  const deleteCartItems = async (cartItems) => {
    try {
      const cartId = cartItems[0].cart_id; // Assuming all items have the same cart_id
      const response = await fetch(
        `http://localhost:3000/api/v1/cartitem/cart/${cartId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error(`Failed to delete cart items for cart ID ${cartId}`);
      }
    } catch (error) {
      console.error("Error deleting cart items:", error);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      // Send a request to delete the item by cartitem_id
      const response = await fetch(
        `http://localhost:3000/api/v1/cartitem/${cartItemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.token}`,
          },
        }
      );

      if (response.ok) {
        console.log(`Successfully removed item with ID ${cartItemId}`);
        // Refresh the cart after successful removal
        refreshCart({ setCartItems });
      } else {
        console.error(`Failed to remove item with ID ${cartItemId}`);
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const historyPages = useHistory();

  const handleHome = () => {
    // Navigate to the "order" page
    historyPages.push("/dashboard");
  };

  return (
    <div className="order-wrapper">
      <div className="order-container">
        <h2 className="order-header">Review Your Order</h2>
        <button className="home-button" onClick={handleHome}>
          <img src={homeImage} alt="Home" />
        </button>
        <ul className="order-list">
          {cartItems.map((cartItem) => (
            <li className="order-item" key={cartItem.cartitem_id}>
              {cartItem.quantity} x {cartItem.name} - $
              {cartItem.price.toFixed(2)}
              <button
                onClick={() => handleRemoveItem(cartItem.cartitem_id)}
                className="remove-button"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <p className="order-total">Total: ${calculateTotal().toFixed(2)}</p>
        <button className="order-button" onClick={handleSubmitOrder}>
          Submit Order
        </button>
        <Link to="/order-history" className="order-history-button">
          Order History
        </Link>
      </div>
    </div>
  );
};

export default Order;
