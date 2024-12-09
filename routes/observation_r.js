const express = require('express');
const router = new express.Router();
const observationController = require('../controllers/observations_c.js');
const validate = require('../utilities/validation.js');

router.post('/', observationController.addObservation);

router.delete('/:id', observationController.deleteObservationById);

module.exports = router;