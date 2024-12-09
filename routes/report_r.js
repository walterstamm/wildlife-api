const express = require('express');
const router = new express.Router();
const reportController = require('../controllers/report_c.js');
const validate = require('../utilities/validation.js');

router.post('/', reportController.addReport);

router.delete('/:id', reportController.deleteReportById);

module.exports = router;