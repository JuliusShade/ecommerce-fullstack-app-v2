const getCartItems = "SELECT * FROM cartitem;";
const addCartItem =
  "INSERT INTO cartitem (cart_id, productid) VALUES ($1, $2) RETURNING *;";
const getCartById = "SELECT * FROM cart WHERE cart_id = $1";
const removeCartItemById = "DELETE FROM cartitem WHERE cartitem_id = $1";
const removeCartByCartId = "DELETE FROM cartitem WHERE cart_id = $1"
const checkCartExists = "SELECT * FROM cart WHERE cart_id = $1";
const getOpenCart = "SELECT * FROM cart WHERE user_id = $1 AND status = 'open'";
const getCartItemsByCartId = `
  SELECT * FROM cartitem WHERE cart_id = $1;
`;
const addCartItemByUserId =
  "INSERT INTO cartitem (cart_id, productid, user_id) VALUES ($1, $2, $3) RETURNING *;";

module.exports = {
  getCartItems,
  addCartItem,
  addCartItemByUserId,
  getCartById,
  removeCartItemById,
  checkCartExists,
  getOpenCart,
  getCartItemsByCartId,
  removeCartByCartId
};
