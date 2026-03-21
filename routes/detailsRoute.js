// Needed Resources
const express = require('express');
const router = new express.Router();
const detailController = require('../controllers/detailController');
const utilities = require('../utilities')

// Route to build inventory detail page
router.get('/detail/:invId', utilities.handleErrors(detailController.buildByInvId))

module.exports = router;