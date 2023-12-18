import React, { useState, useEffect } from "react";
import "./cart.css";

export const fetchCartItems = async (setCartItems) => {
  console.log("Fetching cart items...");

  try {
    const userResponse = await fetch(
      "http://localhost:3000/api/v1/auth/user-data",
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

    const cartResponse = await fetch(
      `http://localhost:3000/api/v1/cart/user/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.token}`,
        },
      }
    );

    if (cartResponse.ok) {
      const cartData = await cartResponse.json();

      if (cartData.length > 0) {
        const cartId = cartData[0].cart_id;

        const cartItemsResponse = await fetch(
          `http://localhost:3000/api/v1/cartitem/${cartId}`
        );

        if (cartItemsResponse.ok) {
          const cartItemsData = await cartItemsResponse.json();

          const quantityDict = {};
          const updatedCartItems = [];

          for (const cartItem of cartItemsData) {
            if (!quantityDict[cartItem.productid]) {
              const productResponse = await fetch(
                `http://localhost:3000/api/v1/products/${cartItem.productid}`
              );

              if (productResponse.ok) {
                const productData = await productResponse.json();
                const productidCount = cartItemsData.filter(
                  (item) => item.productid === cartItem.productid
                ).length;

                updatedCartItems.push({
                  ...cartItem,
                  name: productData[0].name,
                  price: productData[0].price * productidCount,
                  quantity: productidCount,
                });

                quantityDict[cartItem.productid] = true;
              } else {
                console.error(
                  `Failed to fetch product details for product ID ${cartItem.productid}.`
                );
              }
            }
          }

          console.log("Updated cart items:", updatedCartItems);

          // Ensure that setCartItems updates the state
          setCartItems(updatedCartItems);

          return Promise.resolve(updatedCartItems);
        } else {
          console.error(
            "Failed to fetch cart items.",
            cartItemsResponse.statusText
          );
          return Promise.reject("Failed to fetch cart items");
        }
      } else {
        const createCartResponse = await fetch(
          `http://localhost:3000/api/v1/cart/${userId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.token}`,
            },
            body: JSON.stringify({
              user_id: userId,
            }),
          }
        );

        if (createCartResponse.ok) {
          const newCartData = await createCartResponse.json();
          const newCartId = newCartData.cart_id;

          const newCartItemsResponse = await fetch(
            `http://localhost:3000/api/v1/cartitem/${newCartId}`
          );

          if (newCartItemsResponse.ok) {
            const newCartItemsData = await newCartItemsResponse.json();

            if (newCartItemsData.length > 0) {
              setCartItems(newCartItemsData);
              console.log("New cart items set:", newCartItemsData);
            } else {
              console.log("No cart items found for the new cart.");
            }

            return Promise.resolve(newCartItemsData);
          } else {
            console.error(
              "Failed to fetch cart items for the new cart.",
              newCartItemsResponse.statusText
            );
            return Promise.reject("Failed to fetch cart items");
          }
        } else {
          console.error("Failed to create or retrieve cart for the user.");
          return Promise.reject("Failed to create or retrieve cart");
        }
      }
    } else {
      console.error(
        "Failed to fetch user cart information.",
        cartResponse.statusText
      );
      return Promise.reject("Failed to fetch user cart information");
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
    return Promise.reject("Error fetching cart");
  }
};

export const refreshCart = async ({ setCartItems }) => {
  console.log("Refreshing cart...");
  try {
    await fetchCartItems(setCartItems);
  } catch (error) {
    console.error("Error refreshing cart:", error);
  }
};

export const Cart = ({ cartItems, setCartItems }) => {
  const calculateTotal = () => {
    if (!cartItems || !Array.isArray(cartItems)) {
      return 0;
    }

    const productQuantities = {};

    cartItems.forEach((cartItem) => {
      const { productid } = cartItem;
      productQuantities[productid] = (productQuantities[productid] || 0) + 1;
    });

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

    console.log("Total after calculation:", total);

    return total;
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

        // Fetch the updated cart items
        const updatedCartItems = await fetchCartItems(setCartItems);

        // Update the cart items state with the fetched data
        setCartItems(updatedCartItems);
      } else {
        console.error(`Failed to remove item with ID ${cartItemId}`);
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <div className="cart-wrapper">
      <h2 className="cart-header">Shopping Cart</h2>
      <ul className="cart-list">
        {cartItems &&
          Array.isArray(cartItems) &&
          cartItems.map((cartItem) => (
            <li className="item-name" key={cartItem.cartitem_id}>
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
      <p className="total">Total: ${calculateTotal().toFixed(2)}</p>
    </div>
  );
};

const arraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
};

export default Cart;
