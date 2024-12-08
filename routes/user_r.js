const express = require('express');
const router = new express.Router();
const usersController = require('../controllers/users_c.js');
const validate = require('../utilities/validation.js');

router.get('/', usersController.getAllUsers);

router.get('/:id', usersController.getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Add a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fname:
 *                 type: string
 *                 example: "John"
 *               lname:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 example: "JD@test.com"
 *               username:
 *                 type: string
 *                 example: "JD"
 *               password:
 *                 type: string
 *                 example: "123"
 *               state:
 *                 type: string
 *                 example: "Utah"
 *               country:
 *                 type: string
 *                 example: "USA"
 *     responses:
 *       200:
 *         description: User added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "12345"
 *                 fname:
 *                   type: string
 *                   example: "John"
 *                 lname:
 *                   type: string
 *                   example: "Doe"
 *                 email:
 *                   type: string
 *                   example: "JD@test.com"
 *                 username:
 *                   type: string
 *                   example: "JD"
 *                 state:
 *                   type: string
 *                   example: "Utah"
 *                 country:
 *                   type: string
 *                   example: "USA"
 *       400:
 *         description: Invalid input
 */
router.post('/',
    validate.userRules(),
    validate.checkUser,
    usersController.addUser);

/**
 * @swagger
 * /users/{username}:
 *   delete:
 *     summary: Delete a user by username
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/:id',
    validate.idRule(),
    validate.checkId,
    usersController.deleteUserByName);

module.exports = router;
