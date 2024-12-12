const { StatusCodes } = require('http-status-codes');
const db = require('../database/data');
const ObjectId = require('mongodb').ObjectId;
const reportController = {};

// Report Endpoints:
// - GET /reports
reportController.getAllReports = async function (req, res) {
  // #swagger.tags = ['Reports']
  // #swagger.responses[200] = {description: "Success"}
  // #swagger.responses[500] = {description: "Internal Server Error"}
  try {
    const result = await db.getDatabase().db('WildlifeAPI').collection('Reports').find();
    result.toArray().then((reports) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(StatusCodes.OK).json(reports);
    });
  } catch {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('There was an error retrieving reports.');
  }
};

// - GET /reports/:id
reportController.getOneReport = async function (req, res) {
  // #swagger.tags = ['Reports']
  // #swagger.responses[200] = {description: "Success"}
  // #swagger.responses[500] = {description: "Internal Server Error"}
  const targetString = String(req.params.id);
  const target = new ObjectId(targetString);
  try {
    const result = await db
      .getDatabase()
      .db('WildlifeAPI')
      .collection('Reports')
      .find({ _id: target });
    result.toArray().then((reports) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(StatusCodes.OK).json(reports);
    });
  } catch {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('There was an error retrieving reports.');
  }
};

// - GET /reports/by-user/:user-id
reportController.getReportsByUser = async function (req, res) {
  // #swagger.tags = ['Reports']
  // #swagger.responses[200] = {description: "Success"}
  // #swagger.responses[500] = {description: "Internal Server Error"}
  const targetString = String(req.params.animal_id);
  const target = new ObjectId(targetString);
  try {
    const result = await db.getDatabase().db('WildlifeAPI').collection('Reports').find({user_id: target});
    result.toArray().then((reports) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(StatusCodes.OK).json(reports);
    });
  } catch {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('There was an error retrieving reports.');
  }
};

// - Post /reports
// Example ↓↓
// user_id
// observation_id
// date: '2020-02-23'
// time: 'morning, afternoon, evening, and night'
// weather: 'sunny, raining, cloudy....'
reportController.addReport = async function (req, res) {
  // #swagger.tags = ['Reports']
  // #swagger.responses[200] = {description: "Success"}
  // #swagger.responses[500] = {description: "Internal Server Error"}
  const { user_id, observation_id, date, time, weather } = req.body;

  try {
    const database = await db.getDatabase();
    const reportCollection = database.db('WildlifeAPI').collection('Reports');

    const result = await reportCollection.insertOne({
      user_id,
      observation_id,
      date,
      time,
      weather
    });

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to add report' });
  }
};

// - PUT /reports/:id

// - DELETE /reports/:id
reportController.deleteReportById = async function (req, res) {
  // #swagger.tags = ['Reports']
  // #swagger.responses[200] = {description: "Success"}
  // #swagger.responses[500] = {description: "Internal Server Error"}
  const id = req.params.id;
  try {
    const database = await db.getDatabase();
    const reportCollection = database.db('WildlifeAPI').collection('Reports');

    const result = await reportCollection.deleteOne({ _id: ObjectId.createFromHexString(id) });

    if (result.deletedCount == 1) {
      console.log('deleted');
    } else {
      console.log('not found');
    }

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to delete report' });
  }
};

module.exports = reportController;
