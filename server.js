require("dotenv").config();

const express = require("express");
const cors = require("cors");
const productRoutes = require("./src/api/products/routes");
const userRoutes = require("./src/api/users/routes");
const cartItemRoutes = require("./src/api/cartitems/routes");
const cartRoutes = require("./src/api/cart/routes");
const orderRoutes = require("./src/api/order/routes");
const orderItemRoutes = require("./src/api/orderitem/routes");
const authRoutes = require("./src/api/login+register/jwtAuth");
const dashboardRoutes = require("./src/api/dashboard/dashboard");

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/cartitem", cartItemRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/orderitem", orderItemRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.listen(port, () => console.log(`app listening on port: ${port}`));
