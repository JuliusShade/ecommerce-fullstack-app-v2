const getCarts = "SELECT * FROM cart;";
const getCartById = "SELECT * FROM cart WHERE cart_id = $1";
const getCartByUserId = "SELECT * FROM cart WHERE user_id = $1";
const addCart = "INSERT INTO cart (user_id) VALUES ($1) RETURNING cart_id";
const checkCartExists = "SELECT * FROM cart WHERE cart_id = $1";
const removeCartById = "DELETE FROM cart WHERE cart_id = $1";
const getOpenCart = "SELECT * FROM cart WHERE user_id = $1 AND status = 'open'";

module.exports = {
  getCarts,
  getCartById,
  addCart,
  checkCartExists,
  removeCartById,
  getOpenCart,
  getCartByUserId,
};
