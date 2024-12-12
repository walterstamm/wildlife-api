const express = require('express');
const router = new express.Router();
const observationController = require('../controllers/observations_c.js');
const validate = require('../utilities/validation.js');

router.post('/',
    validate.observationRules(),
    validate.checkObservation,
    observationController.addObservation);

router.delete('/:id',
    validate.idRule(),
    validate.checkId,
    observationController.deleteObservationById);

module.exports = router;