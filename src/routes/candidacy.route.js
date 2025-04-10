const express = require("express");
const router = express.Router();
const controller = require("../controllers/candidacy.controller");
const verifyToken = require("../middleware/verifyToken");
const isUserOnly = require("../middleware/isUserOnly");
const isCompanyOnly = require("../middleware/isCompanyOnly");

router.patch("/:id/status", verifyToken, isCompanyOnly, controller.updateCandidacyStatus);


// ✅ Appliquer les middlewares ici directement
router.post("/apply", verifyToken, isUserOnly, controller.applyToJob);
router.get("/job/:jobId", controller.getCandidacysByJob);
router.get("/user/:userId", controller.getCandidacysByUser);
router.get("/user/:userId/refused", controller.getRefusedCandidaciesByUser);
router.get("/user/:userId/accepted", controller.getAcceptedCandidaciesByUser);




module.exports = router;
