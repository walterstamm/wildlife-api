const { StatusCodes } = require('http-status-codes');
const { body, param, validationResult } = require('express-validator');
const validate = {};

validate.idRule = () => {
    return [param('id').isMongoId()];
};

validate.checkId = (req, res, next) => {
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(StatusCodes.BAD_REQUEST).send("Invalid Object Id. Try again.");
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
      res.status(StatusCodes.BAD_REQUEST).send(`Invalid animal:
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
        body('password').trim().escape().isStrongPassword({minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0}).withMessage(`Please provide a password. Current password requirements:\nLength: at least 6 characters\nNumbers: at least 1 number(0-9)\nLetters: at least 1 each uppercase and lowercase`),
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
      res.status(StatusCodes.BAD_REQUEST).send(`Invalid user:
Errors detected:
${errorString}`);
    }
    next();
};

validate.observationRules = () => {
  return [
      body('animal_id').isMongoId().withMessage('Please provide the id of the animal observed.'),
      body('age').trim().escape().custom(value => ['juvenile', 'adolescent', 'adult', 'elderly'].includes(value)).withMessage('Please provide the age of the observed animal. Accepted values are "juvenile", "adolescent", "adult", and "elderly".'),
      body('gender').trim().escape().custom(value => ['male', 'female', 'unknown'].includes(value)).withMessage('Please provide the gender of the observed animal. Accepted values are "male", "female", and "unknown".'),
      body('behavior').trim().escape().isLength({ min: 1 }).withMessage('Please provide what the observed animal was doing.')
  ]
};

validate.checkObservation = (req, res, next) => {
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorString = errors.errors
      .map((error) => {
        return `${error.path}: ${error.msg}`;
      })
      .join('\n');
    res.status(StatusCodes.BAD_REQUEST).send(`Invalid observation:
Errors detected:
${errorString}`);
  }
  next();
};

validate.reportRules = () => {
  return [
    body('user_id').isMongoId().withMessage('Please provide the id of the user making the report.'),
    body('observation_id').isMongoId().withMessage('Please provide the id of the associated observation.'),
    body('date').trim().escape().matches(/^20[0-9]{2}-(0[1-9])|(1[0-2])-[0-3][0-9]$/).withMessage('Please include the date of the report, in the form yyyy-mm-dd.'),
      body('time').trim().escape().custom(value => ['morning', 'afternoon', 'evening', 'night'].includes(value)).withMessage('Please provide the time of day of the report. Accepted values are "morning", "afternoon", "evening", and "night".'),
      body('weather').trim().escape().length({min:1}).withMessage("Please provide the weather at the time of the report.")
  ]
};

validate.checkReport = (req, res, next) => {
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorString = errors.errors
      .map((error) => {
        return `${error.path}: ${error.msg}`;
      })
      .join('\n');
    res.status(StatusCodes.BAD_REQUEST).send(`Invalid report:
Errors detected:
${errorString}`);
  }
  next();
};

module.exports = validate;