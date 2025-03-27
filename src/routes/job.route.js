const express = require("express");
const router = express.Router();
const jobController = require("../controllers/job.controller");
const verifyToken = require("../middleware/verifyToken");
const isCompanyOnly = require("../middleware/isCompanyOnly");
const Job = require("../models/job.model");
const isOwnerOnly = require("../middleware/isOwner");
// POST 
router.post("/create", verifyToken, isCompanyOnly, jobController.createJob);


// GET 
router.get("/alljobs", jobController.getAllJobs);
router.get("/:id", jobController.getJobById);

router.delete("/:id", verifyToken, isCompanyOnly, isOwnerOnly(Job, "company"), jobController.deleteJob);




module.exports = router;
