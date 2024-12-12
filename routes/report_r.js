const express = require('express');
const router = new express.Router();
const reportController = require('../controllers/report_c.js');
const validate = require('../utilities/validation.js');

router.post('/',
    validate.reportRules(),
    validate.checkReport,
    reportController.addReport);

router.delete('/:id',
    validate.idRule(),
    validate.checkId,
    reportController.deleteReportById);

module.exports = router;