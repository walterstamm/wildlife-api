const express = require('express');
const router = new express.Router();
const db = require('../database/data');

router.use('/animals', require('./animal_r'));
router.use('/users', require('./user_r'));

module.exports = router;