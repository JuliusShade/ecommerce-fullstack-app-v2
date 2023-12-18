const { Router } = require("express");
const controller = require("./controller");

const router = Router();

router.get("/", controller.getUsers);
router.post("/", controller.addUser);
router.get("/:id", controller.getUserById);
router.put("/:id", controller.updateUser);
router.delete("/:id", controller.removeUserById);
router.post("/google-login", controller.handleGoogleLogin);

module.exports = router;
