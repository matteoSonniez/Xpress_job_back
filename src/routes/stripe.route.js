const express = require("express");
const router = express.Router();
const stripeController = require("../controllers/stripe.controller");

// POST - Créer une offre
router.post("/payment", stripeController.createPayement);
router.post("/create-subscription", stripeController.createSubscription);

module.exports = router;
