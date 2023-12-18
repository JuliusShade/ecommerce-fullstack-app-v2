const pool = require("../../../db");
const queries = require("./queries");

const getOrdersByUserId = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming the user_id is passed in the URL

    // Use async/await to wait for the query to finish
    const orders = await pool.query(queries.getOrdersByUserId, [userId]);

    // Check if any rows were returned
    if (orders.rows.length > 0) {
      res.json(orders.rows);
    } else {
      // Handle the case where no orders were found
      res.status(404).json({ error: "No orders found for the user." });
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addOrderByUser = async (req, res) => {
  try {
    const { user_id, total, status } = req.body;

    // Use async/await to wait for the query to finish
    const addOrderByUser = await pool.query(
      "INSERT INTO orders (user_id, total, status) VALUES ($1, $2, $3) RETURNING *",
      [user_id, total, status]
    );

    // Check if any rows were inserted
    if (addOrderByUser.rows.length > 0) {
      res.json(addOrderByUser.rows[0]);
    } else {
      // Handle the case where no rows were inserted
      res.status(400).json({ error: "Failed to insert order" });
    }
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addOrder = (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Change variable name for clarity

  pool.query(queries.checkUserExists, [id], (error, orderResult) => {
    if (error) {
      console.error("Error checking for user:", error);
      return res.status(500).send("Error checking for user.");
    }

    if (orderResult.rows.length === 0) {
      return res.status(404).send("User not found.");
    }

    // Use a different variable name when calling the query
    pool.query(
      queries.addOrder,
      [id, status], // Assuming the query expects these parameters
      (error, addItemResult) => {
        if (error) {
          console.error("Error making order:", error);
          return res.status(500).send("Error making order.");
        }

        return res.status(201).send("Order Created Successfully!");
      }
    );
  });
};

const closeOrder = (req, res) => {
  const { order_id } = req.params;
  const status = true;

  pool.query(queries.checkOrderExists, [order_id], (error, orderResult) => {
    if (error) {
      console.error("Error checking for order:", error);
      return res.status(500).send("Error checking for order.");
    }

    if (orderResult.rows.length === 0) {
      return res.status(404).send("Order not found.");
    }

    pool.query(
      queries.closeOrder,
      [order_id, status],
      (error, closeOrderResult) => {
        if (error) {
          console.error("Error closing order:", error);
          return res.status(500).send("Error closing order.");
        }

        return res.status(201).send("Order Closed Successfully!");
      }
    );
  });
};

module.exports = {
  addOrder,
  closeOrder,
  addOrderByUser,
  getOrdersByUserId,
};
