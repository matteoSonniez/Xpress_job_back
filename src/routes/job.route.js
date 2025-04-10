const express = require("express");
const router = express.Router();
const jobController = require("../controllers/job.controller");
const verifyToken = require("../middleware/verifyToken");
const isCompanyOnly = require("../middleware/isCompanyOnly");
const Job = require("../models/job.model");
const isOwnerOnly = require("../middleware/isOwner");

// POST
router.post("/create", verifyToken, isCompanyOnly, jobController.createJob);

// PATCH
router.patch("/:id", verifyToken, isCompanyOnly, isOwnerOnly(Job, "company"), jobController.updateJob);

// DELETE
router.delete("/:id", verifyToken, isCompanyOnly, isOwnerOnly(Job, "company"), jobController.deleteJob);

// GET
router.get("/alljobs", verifyToken, jobController.getAllJobs);
router.get("/search", verifyToken, jobController.searchJobs);
router.get("/company/:companyId", jobController.getJobsByCompany);
router.get("/:id", verifyToken, jobController.getJobById);




module.exports = router;
