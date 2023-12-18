const getUsers = "SELECT * FROM users;";
const getUserById = "SELECT * FROM users WHERE id = $1";
const checkEmailExists = "SELECT u FROM users u WHERE u.email = $1";
const addUser =
  "INSERT INTO users (password, email, firstname, lastname) VALUES ($1, $2, $3, $4)";
const removeUser = "DELETE FROM users WHERE id = $1";
const updateUser =
  "UPDATE users SET password = $1, email = $2, firstname = $3, lastname = $4 WHERE id = $5";

module.exports = {
  getUsers,
  getUserById,
  checkEmailExists,
  addUser,
  removeUser,
  updateUser,
};
