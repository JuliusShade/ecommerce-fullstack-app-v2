const { Router } = require("express");
const controller = require("./controller");

const router = Router();

router.post("/:id", controller.addOrder);
router.put("/:order_id", controller.closeOrder);
router.post("/", controller.addOrderByUser);
router.get("/:userId", controller.getOrdersByUserId);

module.exports = router;
