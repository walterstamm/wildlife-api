const express = require('express');
const router = new express.Router();
const animalController = require('../controllers/animal_c');
const validate = require('../utilities/validation');

/**
 * @swagger
 * /animals:
 *   post:
 *     summary: Add a new animal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 example: "Mammals"
 *               common_name:
 *                 type: string
 *                 example: "Aardvarks"
 *               scientific_name:
 *                 type: string
 *                 example: "Orycteropus afer"
 *               diet:
 *                 type: string
 *                 example: "Insectivore"
 *     responses:
 *       200:
 *         description: Animal added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "12345"
 *                 category:
 *                   type: string
 *                   example: "Mammals"
 *                 common_name:
 *                   type: string
 *                   example: "Aardvarks"
 *                 scientific_name:
 *                   type: string
 *                   example: "Orycteropus afer"
 *                 diet:
 *                   type: string
 *                   example: "Insectivore"
 *       400:
 *         description: Invalid input
 */
router.post('/animals',
    validate.animalRules(),
    validate.checkAnimal,
    animalController.addAnimal);

/**
 * @swagger
 * /animals/{id}:
 *   delete:
 *     summary: Delete an animal by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the animal to delete
 *     responses:
 *       200:
 *         description: Animal deleted successfully
 *       404:
 *         description: Animal not found
 */
router.delete('/animals/:id',
    validate.idRule(),
    validate.checkId,
    animalController.deleteAnimalById);

module.exports = router;
