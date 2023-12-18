const pool = require("../../../db");
const queries = require("./queries");

const createNewCart = (req, res) => {
  const userId = getUserIdFromToken(req); // Implement this function to get the user ID from the token

  pool.query(queries.getOpenCart, [userId], (error, existingCart) => {
    if (error) {
      console.error("Error checking for open cart:", error);
      return res.status(500).send("Error checking for open cart.");
    }

    if (existingCart.rows.length > 0) {
      return res.status(400).send("User already has an open cart.");
    }

    // If no open cart, create a new one
    pool.query(queries.addCart, [userId], (error, newCartResult) => {
      if (error) {
        console.error("Error creating new cart:", error);
        return res.status(500).send("Error creating new cart.");
      }

      const cartId = newCartResult.rows[0].cart_id; // Extract cart_id
      res.status(201).send("New cart created successfully!");
    });
  });
};

const getOpenCart = (req, res) => {
  const userId = getUserIdFromToken(req); // Implement this function to get the user ID from the token

  pool.query(queries.getOpenCart, [userId], (error, results) => {
    if (error) {
      console.error("Error fetching open cart:", error);
      return res.status(500).send("Error fetching open cart.");
    }

    res.status(200).json(results.rows[0]); // Assuming you want to return a single open cart
  });
};

const getCarts = (req, res) => {
  pool.query(queries.getCarts, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const getCartById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getCartById, [id], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const getCartByUserId = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getCartByUserId, [id], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const addCart = (req, res) => {
  const { cart_id } = req.body;

  // Check if the cart exists before adding it
  pool.query(queries.checkCartExists, [cart_id], (error, results) => {
    if (error) {
      console.error("Error checking for cart:", error);
      return res.status(500).send("Error checking for cart.");
    }

    if (results.rows.length > 0) {
      // cart already exists, so return an error response
      res.status(400).send("Cart already exists.");
    } else {
      // cart is not found, so proceed with adding the cart
      pool.query(queries.addCart, [cart_id], (error, results) => {
        if (error) {
          console.error("Error adding cart:", error);
          res.status(500).send("Error adding cart.");
        } else {
          res.status(201).send("Cart Created Successfully!");
        }
      });
    }
  });
};

const AddCartByUserId = (req, res) => {
  const { user_id } = req.body;

  // Check if user_id is provided
  if (!user_id) {
    return res.status(400).send("User ID is required in the request body.");
  }

  pool.query(queries.checkCartExists, [user_id], (error, results) => {
    if (error) {
      console.error("Error checking for cart:", error);
      return res.status(500).send("Error checking for cart.");
    }

    if (results.rows.length > 0) {
      // Cart already exists, so return an error response
      res.status(400).send("Cart already exists.");
    } else {
      // Cart is not found, so proceed with adding the cart
      pool.query(queries.addCart, [user_id], (error, results) => {
        if (error) {
          console.error("Error adding cart:", error);
          res.status(500).send("Error adding cart.");
        } else {
          res.status(201).send("Cart Created Successfully!");
        }
      });
    }
  });
};

const removeCartById = (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(400).send("Invalid cart ID.");
    return;
  }

  pool.query(queries.removeCartById, [id], (error, results) => {
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
  getCarts,
  getCartById,
  addCart,
  removeCartById,
  getOpenCart,
  createNewCart,
  getCartByUserId,
  AddCartByUserId,
};
