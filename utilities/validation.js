const { body, param, validationResult } = require('express-validator');
const validate = {};

validate.idRule = () => {
    return [param('id').isMongoId()];
};

validate.checkId = (req, res, next) => {
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send("Invalid Object Id. Try again.");
    }
    next();
};

validate.animalRules = () => {
    return [
        body('category').trim().escape().isLength({ min: 1 }).withMessage('Please provide a category.'),
        body('common_name').trim().escape().isLength({ min: 1 }).withMessage('Please provide the common name.'),
        body('diet').trim().escape().isLength({ min: 1 }).withMessage('Please include the animal\'s diet.'),
        body('scientific_name').trim().escape().isLength({ min: 1 }).withMessage('Please provide the scientific name.')
    ]
};

validate.checkAnimal = (req, res, next) => {
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorString = errors.errors
        .map((error) => {
          return `${error.path}: ${error.msg}`;
        })
        .join('\n');
      res.status(400).send(`Invalid animal:
Errors detected:
${errorString}`);
    }
    next();
};

validate.userRules = () => {
    return [
        body('fname').trim().escape().isLength({ min: 1 }).withMessage('Please provide a first name.'),
        body('lname').trim().escape().isLength({ min: 1 }).withMessage('Please provide a last name.'),
        body('username').trim().escape().isLength({ min: 1 }).withMessage('Please include a username.'),
        body('email').trim().escape().isEmail().withMessage('Please provide an email address.'),
        //If we want to make password requirements stricter, message Andrew to update the following validation rule
        body('password').trim().escape().isStrongPassword({minLength: 3}).withMessage(`Please provide a password. Current password requirements:\nLength: at least 3 characters`),
        body('state').trim().escape().isLength({ min: 1 }). withMessage('Please provide a state, province, etc.'),
        body('country').trim().escape().isLength({ min: 1 }).withMessage('Please provide a country.')
    ]
};

validate.checkUser = (req, res, next) => {
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorString = errors.errors
        .map((error) => {
          return `${error.path}: ${error.msg}`;
        })
        .join('\n');
      res.status(400).send(`Invalid user:
Errors detected:
${errorString}`);
    }
    next();
};

module.exports = validate;