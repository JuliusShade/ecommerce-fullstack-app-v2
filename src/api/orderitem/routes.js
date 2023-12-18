const { Router } = require("express");
const controller = require("./controller");

const router = Router();

router.get("/", controller.getOrderItems);
router.post("/:order_id/:orderitemid/:productid", controller.addOrderItem);
router.put("/:orderitemid", controller.updateOrderItem);
router.delete("/:orderitemid", controller.deleteOrderItem);

module.exports = router;
