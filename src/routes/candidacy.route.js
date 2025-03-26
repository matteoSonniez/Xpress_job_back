const express = require("express");
const router = express.Router();
const controller = require("../controllers/candidacy.controller");

router.post("/apply", controller.applyToJob);
router.get("/job/:jobId", controller.getCandidacysByJob);
router.get("/user/:userId", controller.getCandidacysByUser);


module.exports = router;
