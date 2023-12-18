const pool = require("../../../db");
const queries = require("./queries");

const getProducts = (req, res) => {
  pool.query(queries.getProducts, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const getProductById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getProductById, [id], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const addProduct = (req, res) => {
  const { name, price, description } = req.body;

  // Check if the name already exists
  pool.query(queries.checkNameExists, [name], (error, results) => {
    if (error) {
      console.error("Error checking for existing product name:", error);
      res.status(500).send("Error checking for existing product name.");
      return;
    }

    if (results.rows.length > 0) {
      // Product name already exists, so return an error response
      res.status(400).send("Name already exists.");
    } else {
      // Product name is not found, so proceed with adding the product
      pool.query(
        queries.addProduct,
        [name, price, description],
        (error, results) => {
          if (error) {
            console.error("Error adding product:", error);
            res.status(500).send("Error adding product.");
          } else {
            res.status(201).send("Product Created Successfully!");
          }
        }
      );
    }
  });
};

const removeProductbyId = (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(400).send("Invalid product ID.");
    return;
  }

  pool.query(queries.removeProduct, [id], (error, results) => {
    if (error) {
      console.error("Error removing product:", error);
      res.status(500).send("Error removing product.");
    } else if (results.rowCount === 0) {
      res.status(404).send("Product does not exist in the database.");
    } else {
      res.status(200).send("Product removed successfully.");
    }
  });
};

const updateProduct = (req, res) => {
  const id = parseInt(req.params.id);
  const { name, price, description } = req.body;

  pool.query(queries.getProductById, [id], (error, results) => {
    if (!results.rows.length) {
      res.status(404).send("Product does not exist in the database.");
      return;
    }

    pool.query(
      queries.updateProduct,
      [name, price, description, id],
      (error, results) => {
        if (error) {
          console.error("Error updating product:", error);
          res.status(500).send("Error updating product.");
          return;
        }
        res.status(200).send("Product updated successfully!");
      }
    );
  });
};

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  removeProductbyId,
  updateProduct,
};
