const express = require('express');
const router = express.Router();
const rdvcontroller = require('../controllers/rdv.controller');


router.post("/create", rdvcontroller.CreateRdv);

module.exports = router;