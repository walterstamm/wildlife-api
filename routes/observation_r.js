const express = require('express');
const router = new express.Router();
const observationController = require('../controllers/observations_c.js');
const validate = require('../utilities/validation.js');

router.get('/', observationController.getAllObservations);

router.get('/:id',
    validate.idRule(),
    validate.checkId,
    observationController.getOneObservation);

router.get('/by-animal/:animal_id',
    validate.animalIdRule(),
    validate.checkId,
    observationController.getObservationsByAnimal);

router.post('/',
    validate.observationRules(),
    validate.checkObservation,
    observationController.addObservation);

router.delete('/:id',
    validate.idRule(),
    validate.checkId,
    observationController.deleteObservationById);

module.exports = router;