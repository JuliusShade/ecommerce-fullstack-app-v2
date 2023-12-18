const pool = require("../../../db");
const queries = require("./queries");

const getCartItemsByCartId = (req, res) => {
  const { cart_id } = req.params;

  pool.query(queries.getCartItemsByCartId, [cart_id], (error, results) => {
    if (error) {
      console.error("Error getting cart items by cart_id:", error);
      res.status(500).send("Error getting cart items.");
    } else {
      res.status(200).json(results.rows);
    }
  });
};

const getCartItems = (req, res) => {
  pool.query(queries.getCartItems, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const addCartItemByUserId = (req, res) => {
  const { cart_id, productid, user_id } = req.body;

  pool.query(
    queries.addCartItemByUserId,
    [cart_id, productid, user_id],
    (error, results) => {
      if (error) {
        console.error("Error adding cart item:", error);
        res.status(500).send("Error adding cart item.");
      } else {
        res.status(201).json(results.rows[0]); // Assuming you want to return the added cart item
      }
    }
  );
};

const addCartItem = (req, res) => {
  const getUserIdFromToken = (req) => {
    const jwtToken = req.header("Authorization");

    if (!jwtToken) {
      throw new Error("Authorization token not provided");
    }

    const token = jwtToken.split(" ")[1]; // Remove "Bearer " prefix

    try {
      const payload = jwt.verify(token, process.env.jwtSecret);
      return payload.user;
    } catch (err) {
      throw new Error("Invalid token");
    }
  };

  const { productid } = req.body;
  const { cart_id } = req.params;
  const userId = getUserIdFromToken(req); // Implement this function to get the user ID from the token

  pool.query(queries.getOpenCart, [userId], (error, existingCart) => {
    if (error) {
      console.error("Error checking for open cart:", error);
      return res.status(500).send("Error checking for open cart.");
    }

    if (existingCart.rows.length === 0) {
      return res.status(404).send("User does not have an open cart.");
    }

    const cartId = existingCart.rows[0].cart_id;

    // Use a different variable name when calling the query
    pool.query(
      queries.addCartItem,
      [cartId, productid], // Assuming the query expects these parameters
      (error, addItemResult) => {
        if (error) {
          console.error("Error adding cart item:", error);
          return res.status(500).send("Error adding cart item.");
        }

        res.status(201).send("Cart Item Created Successfully!");
      }
    );
  });
};

const removeCartItemById = (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(400).send("Invalid cart item ID.");
    return;
  }

  pool.query(queries.removeCartItemById, [id], (error, results) => {
    if (error) {
      console.error("Error removing cart item:", error);
      res.status(500).send("Error removing cart item.");
    } else if (results.rowCount === 0) {
      res.status(404).send("Cart item does not exist in the database.");
    } else {
      res.status(200).send("Cart item removed successfully.");
    }
  });
};

const removeCartByCartId = (req, res) => {
  const cartId = parseInt(req.params.cart_id);

  if (isNaN(cartId)) {
    res.status(400).send("Invalid cart ID.");
    return;
  }

  pool.query(queries.removeCartByCartId, [cartId], (error, results) => {
    if (error) {
      console.error("Error removing cart:", error);
      res.status(500).send("Error removing cart.");
    } else if (results.rowCount === 0) {
      res.status(404).send("Cart does not exist in the database.");
    } else {
      res.status(200).send("Cart removed successfully.");
    }
  });
};

module.exports = {
  getCartItems,
  addCartItem,
  removeCartItemById,
  removeCartByCartId,
  getCartItemsByCartId,
  addCartItemByUserId,
};
