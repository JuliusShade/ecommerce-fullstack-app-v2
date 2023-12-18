const { Router } = require("express");
const controller = require("./controller");

const router = Router();

router.get("/", controller.getCarts);
router.get("/:id", controller.getCartById);
router.post("/", controller.addCart);
router.post("/:id", controller.AddCartByUserId);
router.delete("/:id", controller.removeCartById);
router.post("/open", controller.createNewCart);
router.get("/user/:id", controller.getCartByUserId);

module.exports = router;
