const getProducts = "SELECT * FROM products;";
const getProductById = "SELECT * FROM products WHERE productid = $1";
const checkNameExists = "SELECT p FROM products p WHERE p.name = $1";
const addProduct =
  "INSERT INTO products (name, price, description) VALUES ($1, $2, $3)";
const removeProduct = "DELETE FROM products WHERE productid = $1";
const updateProduct =
  "UPDATE products SET name = $1, price = $2, description = $3 WHERE productid = $4";

module.exports = {
  getProducts,
  getProductById,
  checkNameExists,
  addProduct,
  removeProduct,
  updateProduct,
};
