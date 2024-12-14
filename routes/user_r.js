const express = require('express');
const router = new express.Router();
const usersController = require('../controllers/users_c.js');
const validate = require('../utilities/js/validation.js');

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
 *               githubId:
 *                 type: string
 *                 example: "78896541"
 *               username:
 *                 type: string
 *                 example: "johndoegithub"
 *               displayName:
 *                 type: string
 *                 example: "John Doe (GitHub)"
 *               profileUrl:
 *                 type: string
 *                 example: "https://github.com/johndoegithub"
 *     responses:
 *       200:
 *         description: User added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 githubId:
 *                   type: string
 *                   example: "78896541"
 *                 username:
 *                   type: string
 *                   example: "johndoegithub"
 *                 displayName:
 *                   type: string
 *                   example: "John Doe (GitHub)"
 *                 profileUrl:
 *                   type: string
 *                   example: "https://github.com/johndoegithub"
 *       400:
 *         description: Invalid input
 */
router.post('/', validate.userRules(), validate.checkUser, usersController.createOrUpdateUser);

router.put('/:id', validate.userRules(), validate.checkUser, usersController.createOrUpdateUser);
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
router.delete('/:id', usersController.deleteUserById);

module.exports = router;
