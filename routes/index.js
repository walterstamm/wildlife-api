const express = require('express');
const router = new express.Router();
const animalController = require('../controllers/animal_c');

router.post('/animals', animalController.addAnimal);
router.delete('/animals/:id', animalController.deleteAnimalById);

router.post('/users', animalController.addUser);
router.delete('/users/:username', animalController.deleteUserByName);

module.export = router;