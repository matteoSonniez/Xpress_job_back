const express = require('express');
const router = express.Router();
const userRouter = require('./user.route');
const rdvRouter = require('./rdv.route')
const jobRoutes = require("./job.route");
const candidacyRoutes = require("./candidacy.route");
const userRoutes = require("./user.route");
const stripeRoutes = require("./stripe.route");

router.use("/users", userRoutes);
router.use("/candidacy", candidacyRoutes);
router.use("/user", userRouter);
router.use("/rdv", rdvRouter);
router.use("/jobs", jobRoutes);
router.use("/stripe", stripeRoutes);

module.exports = router;