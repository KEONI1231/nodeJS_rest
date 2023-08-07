const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/todoApp/user/create", userController.createUser);
router.post("/todoApp/user/login", userController.loginUser);
router.post("/smallchat/user/create", userController.createChatUser);
router.post("/smallchat/user/login", userController.loginChatUser);

module.exports = router;
