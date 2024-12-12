const { StatusCodes } = require('http-status-codes');
const db = require('../database/data');
const ObjectId = require('mongodb').ObjectId;
const observationController = {};

// Observation Endpoints:
// - GET /observations

observationController.getAllObservations = async function (req, res) {
  // #swagger.tags = ['Observations']
  // #swagger.responses[200] = {description: "Success"}
  // #swagger.responses[500] = {description: "Internal Server Error"}
  try {
    const result = await db.getDatabase().db('WildlifeAPI').collection('Observations').find();
    result.toArray().then((observations) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(StatusCodes.OK).json(observations);
    });
  } catch {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('There was an error retrieving observations.');
  }
};

// - GET /observations/:id
observationController.getOneObservation = async function (req, res) {
  // #swagger.tags = ['Observations']
  // #swagger.responses[200] = {description: "Success"}
  // #swagger.responses[500] = {description: "Internal Server Error"}
  const targetString = String(req.params.id);
  const target = new ObjectId(targetString);
  try {
    const result = await db
      .getDatabase()
      .db('WildlifeAPI')
      .collection('Observations')
      .find({ _id: target });
    result.toArray().then((observations) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(StatusCodes.OK).json(observations);
    });
  } catch {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('There was an error retrieving observations.');
  }
};

// - GET /observations/by-animal/:animal-id
observationController.getObservationsByAnimal = async function (req, res) {
  // #swagger.tags = ['Observations']
  // #swagger.responses[200] = {description: "Success"}
  // #swagger.responses[500] = {description: "Internal Server Error"}
  const targetString = String(req.params.animal_id);
  const target = new ObjectId(targetString);
  try {
    const result = await db.getDatabase().db('WildlifeAPI').collection('Observations').find({animal_id: target});
    result.toArray().then((observations) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(StatusCodes.OK).json(observations);
    });
  } catch {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('There was an error retrieving observations.');
  }
};


// - POST /observations
// Example ↓↓
// animal_id
// age: 'juvenile, adolescent, adult, elderly'
// gender: 'male, female, and unknown'
// behavior: 'playing, hunting, sleeping...'
observationController.addObservation = async function (req, res) {
  // #swagger.tags = ['Observations']
  // #swagger.responses[200] = {description: "Success"}
  // #swagger.responses[500] = {description: "Internal Server Error"}
  const { animal_id, age, gender, behavior } = req.body;

  try {
    const database = await db.getDatabase();
    const observationCollection = database.db('WildlifeAPI').collection('Observations');

    const result = await observationCollection.insertOne({
      animal_id,
      age,
      gender,
      behavior
    });

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to add observation' });
  }
}

// - PUT /observations/:id

// - DELETE /observations/:id
observationController.deleteObservationById = async function (req, res) {
  // #swagger.tags = ['Observations']
  // #swagger.responses[200] = {description: "Success"}
  // #swagger.responses[500] = {description: "Internal Server Error"}
  const id = req.params.id;
  try {
    const database = await db.getDatabase();
    const observationCollection = database.db('WildlifeAPI').collection('Observations');

    const result = await observationCollection.deleteOne({ _id: ObjectId.createFromHexString(id) });

    if (result.deletedCount == 1) {
      console.log('deleted');
    } else {
      console.log('not found');
    }

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to delete observation' });
  }
}

module.exports = observationController;
