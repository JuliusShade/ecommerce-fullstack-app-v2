const pool = require("../../../db");
const queries = require("./queries");

const getUsers = (req, res) => {
  pool.query(queries.getUsers, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getUserById, [id], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const addUser = (req, res) => {
  const { password, email, firstname, lastname } = req.body;

  // Check if the email already exists
  pool.query(queries.checkEmailExists, [email], (error, results) => {
    if (error) {
      console.error("Error checking for existing email:", error);
      res.status(500).send("Error checking for existing email.");
      return;
    }

    if (results.rows.length > 0) {
      // Email already exists, so return an error response
      res.status(400).send("Email already exists.");
    } else {
      // Email is not found, so proceed with adding the product
      pool.query(
        queries.addUser,
        [password, email, firstname, lastname],
        (error, results) => {
          if (error) {
            console.error("Error adding user:", error);
            res.status(500).send("Error adding user.");
          } else {
            res.status(201).send("User Created Successfully!");
          }
        }
      );
    }
  });
};

// Add a new controller method for handling Google login/registration
const handleGoogleLogin = (req, res) => {
  const { email, firstname, lastname } = req.body;

  // Check if the email already exists
  pool.query(queries.checkEmailExists, [email], (error, results) => {
    if (error) {
      console.error("Error checking for existing email:", error);
      res.status(500).send("Error checking for existing email.");
      return;
    }

    if (results.rows.length > 0) {
      // User exists, return user information
      res.status(200).json(results.rows[0]);
    } else {
      // User does not exist, proceed with registration
      pool.query(
        queries.addUser,
        [email, firstname, lastname],
        (error, results) => {
          if (error) {
            console.error("Error adding user:", error);
            res.status(500).send("Error adding user.");
          } else {
            // Return the newly registered user information
            res.status(201).json(results.rows[0]);
          }
        }
      );
    }
  });
};

const removeUserById = (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(400).send("Invalid user ID.");
    return;
  }

  pool.query(queries.removeUser, [id], (error, results) => {
    if (error) {
      console.error("Error removing user:", error);
      res.status(500).send("Error removing user.");
    } else if (results.rowCount === 0) {
      res.status(404).send("User does not exist in the database.");
    } else {
      res.status(200).send("User removed successfully.");
    }
  });
};

const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const { password, email, firstname, lastname } = req.body;

  pool.query(queries.getUserById, [id], (error, results) => {
    if (!results.rows.length) {
      res.status(404).send("User does not exist in the database.");
      return;
    }

    pool.query(
      queries.updateUser,
      [password, email, firstname, lastname, id],
      (error, results) => {
        if (error) {
          console.error("Error updating user:", error);
          res.status(500).send("Error updating user.");
          return;
        }
        res.status(200).send("User updated successfully!");
      }
    );
  });
};

module.exports = {
  addUser,
  getUsers,
  getUserById,
  handleGoogleLogin, // Add the new method for Google login/registration
  removeUserById,
  updateUser,
};
