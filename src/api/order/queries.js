const addOrder =
  "INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *;";
const checkOrderExists = "SELECT * FROM orders WHERE order_id = $1";
const closeOrder = "UPDATE orders SET status = $2 WHERE order_id = $1";
const addOrderByUser =
  "INSERT INTO orders (user_id, total, status) VALUES ($1, $2, $3) RETURNING *";
const getOrdersByUserId = "SELECT * FROM orders where user_id = $1";

module.exports = {
  addOrder,
  checkOrderExists,
  closeOrder,
  addOrderByUser,
  getOrdersByUserId,
};
