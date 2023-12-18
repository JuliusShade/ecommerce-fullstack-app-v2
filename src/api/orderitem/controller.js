const pool = require("../../../db");
const queries = require("./queries");

const getOrderItems = (req, res) => {
  pool.query(queries.getOrderItems, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const addOrderItem = (req, res) => {
  const { productid, order_id, orderitemid } = req.params;
  const { quantity } = req.body;

  // Check if the product exists
  pool.query(
    queries.checkProductExists,
    [productid],
    (error, productResult) => {
      if (error) {
        console.error("Error checking for product:", error);
        return res.status(500).send("Error checking for product.");
      }

      if (productResult.rows.length === 0) {
        return res.status(404).send("Product not found.");
      }

      // Check if the order exists
      pool.query(queries.checkOrderExists, [order_id], (error, orderResult) => {
        if (error) {
          console.error("Error checking for order:", error);
          return res.status(500).send("Error checking for order.");
        }

        if (orderResult.rows.length === 0) {
          return res.status(404).send("Order not found.");
        }

        // Check if the order item already exists for this product in the order
        pool.query(
          queries.checkOrderItemExists,
          [orderitemid],
          (error, orderItemResult) => {
            if (error) {
              console.error("Error checking for order item:", error);
              return res.status(500).send("Error checking for order item.");
            }

            if (orderItemResult.rows.length > 0) {
              return res.status(400).send("Order item already exists.");
            }

            // Order item doesn't exist, insert a new row
            pool.query(
              queries.addOrderItem,
              [order_id, productid, quantity],
              (error, addItemResult) => {
                if (error) {
                  console.error("Error adding order item:", error);
                  return res.status(500).send("Error adding order item.");
                }

                // Update the order total
                pool.query(
                  queries.updateOrderTotal,
                  [order_id],
                  (error, updateResult) => {
                    if (error) {
                      console.error("Error updating order total:", error);
                      return res
                        .status(500)
                        .send("Error updating order total.");
                    }

                    return res
                      .status(201)
                      .send("Order Item Created Successfully!");
                  }
                );
              }
            );
          }
        );
      });
    }
  );
};

const updateOrderItem = (req, res) => {
  const { orderitemid } = req.params;
  const { quantity } = req.body;

  pool.query(
    queries.checkOrderItemExists,
    [orderitemid],
    (error, orderItemResult) => {
      if (error) {
        console.error("Error checking for order item:", error);
        return res.status(500).send("Error checking for order item.");
      }

      if (orderItemResult.rows.length === 0) {
        return res.status(404).send("Order item not found.");
      }

      const existingOrderItem = orderItemResult.rows[0];
      const updatedQuantity = quantity;

      // Update the order item quantity
      pool.query(
        queries.updateOrderItemQuantity,
        [updatedQuantity, existingOrderItem.orderitemid],
        (error, updateResult) => {
          if (error) {
            console.error("Error updating order item:", error);
            return res.status(500).send("Error updating order item.");
          }

          // Update the order total
          pool.query(
            queries.updateOrderTotal,
            [existingOrderItem.order_id], // Corrected the parameter
            (error, updateResult) => {
              if (error) {
                console.error("Error updating order total:", error);
                return res.status(500).send("Error updating order total.");
              }

              return res.status(201).send("Order Item Update Successfully!");
            }
          );
        }
      );
    }
  );
};

const deleteOrderItem = (req, res) => {
  const { orderitemid } = req.params;

  // Check if the order item exists
  pool.query(
    queries.checkOrderItemExists,
    [orderitemid],
    (error, orderItemResult) => {
      if (error) {
        console.error("Error checking for order item:", error);
        return res.status(500).send("Error checking for order item.");
      }

      if (orderItemResult.rows.length === 0) {
        return res.status(404).send("Order item not found.");
      }

      const existingOrderItem = orderItemResult.rows[0];

      // Delete the order item
      pool.query(
        queries.deleteOrderItem,
        [orderitemid],
        (error, deleteResult) => {
          if (error) {
            console.error("Error deleting order item:", error);
            return res.status(500).send("Error deleting order item.");
          }

          // Update the order total
          pool.query(
            queries.updateOrderTotal,
            [existingOrderItem.order_id],
            (error, updateResult) => {
              if (error) {
                console.error("Error updating order total:", error);
                return res.status(500).send("Error updating order total.");
              }

              return res.status(201).send("Order Item Deleted Successfully!");
            }
          );
        }
      );
    }
  );
};

module.exports = {
  getOrderItems,
  addOrderItem,
  updateOrderItem,
  deleteOrderItem,
};
