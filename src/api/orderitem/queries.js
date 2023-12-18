const getOrderItems = "SELECT * FROM orderitem;";
const addOrderItem = `
WITH product_price AS (
  SELECT price FROM products WHERE productid = $2
), inserted_order_item AS (
  INSERT INTO orderitem (order_id, product_id, quantity, price)
  SELECT $1, $2, $3, (SELECT price FROM product_price)
  RETURNING *
)
UPDATE orders AS o
SET total = o.total + (inserted_order_item.price * $3)
FROM inserted_order_item
WHERE o.order_id = $1
RETURNING o.order_id, o.total;
`;
const checkProductExists = "SELECT * FROM products WHERE productid = $1";
const checkOrderExists = "SELECT * FROM orders WHERE order_id = $1";
const checkOrderItemExists = "SELECT * FROM orderitem WHERE orderitemid = $1";
const updateOrderItemQuantity =
  "UPDATE orderitem SET quantity = $1 WHERE orderitemid = $2 RETURNING *;";
const updateOrderTotal = `
  UPDATE "orders"
  SET total = (
    SELECT SUM(oi.quantity * p.price) 
    FROM orderitem oi
    JOIN products p ON oi.product_id = p.productid
    WHERE oi.order_id = $1
  )
  WHERE order_id = $1
  RETURNING total;
`;
const deleteOrderItem =
  "DELETE FROM orderitem WHERE orderitemid = $1 RETURNING *;";

module.exports = {
  getOrderItems,
  addOrderItem,
  checkProductExists,
  checkOrderExists,
  checkOrderItemExists,
  updateOrderItemQuantity,
  updateOrderTotal,
  deleteOrderItem,
};
