const express = require('express');
const router = new express.Router();
const reportController = require('../controllers/report_c.js');
const validate = require('../utilities/js/validation.js');

router.get('/', reportController.getAllReports);

router.get('/:id', validate.idRule(), validate.checkId, reportController.getOneReport);

router.get(
  '/by-user/:user_id',
  validate.userIdRule(),
  validate.checkId,
  reportController.getReportsByUser
);

router.post('/', validate.reportRules(), validate.checkReport, reportController.addReport);

router.put(
  '/:id',
  validate.idRule(),
  validate.checkId,
  validate.reportRules(),
  validate.checkReport,
  reportController.editReport
);

router.delete('/:id', validate.idRule(), validate.checkId, reportController.deleteReportById);

module.exports = router;
