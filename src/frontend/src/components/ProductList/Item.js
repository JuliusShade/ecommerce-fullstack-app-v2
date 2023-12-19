import React, { useState, useEffect } from "react";
import { Cart, refreshCart, fetchCartItems } from "../Cart/cart.js";
import "./item.css";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const updateCart = (newCartItems) => {
    setCartItems(newCartItems);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsResponse = await fetch(
          `http://${process.env.HOST_NAME}/api/v1/products`
        );
        const productsData = await productsResponse.json();
        setItems(productsData);

        // Fetch cart items
        const cartItemsData = await fetchCartItems(setCartItems);
        setCartItems(cartItemsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = async (productId) => {
    console.log("Adding product to cart:", productId);
    try {
      const userResponse = await fetch(
        `http://${process.env.HOST_NAME}/api/v1/auth/user-data`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.token,
          },
        }
      );

      if (!userResponse.ok) {
        console.error("Failed to retrieve user information.");
        return;
      }

      const userData = await userResponse.json();
      const userId = userData.id;

      const checkCartResponse = await fetch(
        `http://${process.env.HOST_NAME}/api/v1/cart/user/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.token}`,
          },
        }
      );

      if (checkCartResponse.ok) {
        const existingCartData = await checkCartResponse.json();
        const existingCartId = existingCartData[0]?.cart_id;

        const addToCartResponse = await fetch(
          `http://${process.env.HOST_NAME}/api/v1/cartitem`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.token}`,
            },
            body: JSON.stringify({
              cart_id: existingCartId,
              productid: productId,
              user_id: userId,
            }),
          }
        );

        if (addToCartResponse.ok) {
          console.log("Product added to cart successfully!");

          // Refresh the cart in real-time
          await refreshCart({ setCartItems });
        } else {
          console.error("Failed to add product to cart.");
        }
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  return (
    <div className="item-list-container">
      <h2 className="products-header">Products</h2>
      <ul className="item-list">
        {items.map((item) => (
          <li key={item.productid} className="item">
            <h3 className="item-name">{item.name}</h3>
            <p className="item-price">Price: ${item.price}</p>{" "}
            {/* Clearly stating the price */}
            <p className="item-description">{item.description}</p>
            <button onClick={() => handleAddToCart(item.productid)}>
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
      {/* Cart component, if present */}
      <Cart cartItems={cartItems} setCartItems={setCartItems} />
    </div>
  );
};

export default ItemList;
