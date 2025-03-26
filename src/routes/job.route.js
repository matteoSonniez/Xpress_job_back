const express = require("express");
const router = express.Router();
const jobController = require("../controllers/job.controller");

// POST - Créer une offre
router.post("/create", jobController.createJob);

// GET - Toutes les offres
router.get("/alljobs", jobController.getAllJobs);

module.exports = router;
