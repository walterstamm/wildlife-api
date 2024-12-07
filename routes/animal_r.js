const express = require('express');
const router = new express.Router();
const animalController = require('../controllers/animal_c');

router.post('/', animalController.addAnimal);
router.delete('/:id', animalController.deleteAnimalById);

module.exports = router;