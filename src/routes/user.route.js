const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const controller = require("../controllers/user.controller");



router.get("/get-user", userController.getUser);
router.post("/register", userController.registerUser);
router.post("/register-company", userController.registerUserCompany);
router.post("/login", userController.loginUser);
router.post("/create", controller.createUser);

module.exports = router;