const express = require("express");
const router = express.Router();
const controller = require("../controllers/candidacy.controller");
const verifyToken = require("../middleware/verifyToken");
const isUserOnly = require("../middleware/isUserOnly");

// ✅ Appliquer les middlewares ici directement
router.post("/apply", verifyToken, isUserOnly, controller.applyToJob);
router.get("/job/:jobId", controller.getCandidacysByJob);
router.get("/user/:userId", controller.getCandidacysByUser);

module.exports = router;
