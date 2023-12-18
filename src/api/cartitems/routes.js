const { Router } = require("express");
const controller = require("./controller");

const router = Router();

// Define routes for cart items
router.get("/", controller.getCartItems);
router.post("/:cart_id", controller.addCartItem);
router.post("/", controller.addCartItemByUserId);
router.delete("/:id", controller.removeCartItemById);
router.delete("/cart/:cart_id", controller.removeCartByCartId);
router.get("/:cart_id", controller.getCartItemsByCartId);

module.exports = router;
