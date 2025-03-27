const express = require('express');
const router = express.Router();
const userRouter = require('./user.route');
const rdvRouter = require('./rdv.route')

router.use("/user", userRouter);
router.use("/rdv", rdvRouter);


module.exports = router;