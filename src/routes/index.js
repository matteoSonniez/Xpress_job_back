const express = require('express');
const router = express.Router();
const userRouter = require('./user.route');
const jobRoutes = require("./job.route");
const candidacyRoutes = require("./candidacy.route");
const userRoutes = require("./user.route");

router.use("/users", userRoutes);
router.use("/candidacy", candidacyRoutes);
router.use("/user", userRouter);
router.use("/jobs", jobRoutes);
router.use("/auth", require("./auth.route"));


module.exports = router;