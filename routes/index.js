const express = require('express');
const router = new express.Router();
const passport = require('passport');

// eslint-disable-next-line no-unused-vars
router.get('/login', passport.authenticate('github'), (_req, _res) => {
  // The request will be redirected to GitHub for authentication, so this
  // function will not be called.
  // #swagger.tags = ['General']
  // #swagger.responses[200] = {description: "Success"}
  // #swagger.responses[500] = {description: "Internal Server Error"}
});

router.get('/logout', (req, res, next) => {
  // #swagger.tags = ['General']
  // #swagger.responses[200] = {description: "Success"}
  // #swagger.responses[500] = {description: "Internal Server Error"}
  req.logout(err => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

router.use('/animals', require('./animal_r'));
router.use('/users', require('./user_r'));
router.use('/observations', require('./observation_r'));
router.use('/reports', require('./report_r'));

module.exports = router;