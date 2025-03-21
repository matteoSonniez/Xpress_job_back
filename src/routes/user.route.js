const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get("/get-user", userController.getUser);
router.post("/register", userController.registerUser);
router.post("/register-company", userController.registerUserCompany);
router.post("/login", userController.loginUser);

module.exports = router;