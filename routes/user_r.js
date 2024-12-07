const express = require('express');
const router = new express.Router();
const usersController = require('../controllers/users_c.js');

router.post('/', usersController.addUser);
router.delete('./:username', usersController.deleteUserByName);

module.exports = router;