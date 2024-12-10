const express = require('express');
const router = new express.Router();
const db = require('../database/data');

router.use('/animals', require('./animal_r'));
router.use('/users', require('./user_r'));
router.use('/observations', require('./observation_r'));
router.use('/reports', require('./report_r'));

module.exports = router;