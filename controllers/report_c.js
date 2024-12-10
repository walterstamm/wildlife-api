const { StatusCodes } = require('http-status-codes');
const { BAD_REQUEST, OK } = StatusCodes;
const db = require('../database/data');
const ObjectId = require('mongodb').ObjectId;
const reportController = {};

// Report Endpoints:
// - GET /reports

// - Post /reports
// Example ↓↓
// user_id
// observation_id
// date: '2020-2-2'
// time: 'morning, afternoon, evening, and night'
// weather: 'sunny, raining, cloudy....'
reportController.addReport = async function(req, res){
  // #swagger.tags = ['Reports']
  const {user_id, observation_id, date, time, weather} = req.body;

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

    return res.status(OK).json(result);
  } catch (error) {
    return res.status(BAD_REQUEST).json({ error: 'Failed to add report' });
  }
};

// - GET /reports/:id
// - GET /reports/by-animal/:animal-id
// - PUT /reports/:id

// - DELETE /reports/:id
reportController.deleteReportById = async function (req, res) {
    // #swagger.tags = ['Reports']
    const id = req.params.id;
    try {
      const database = await db.getDatabase();
      const reportCollection = database.db('WildlifeAPI').collection('Reports');
  
      const result = await reportCollection.deleteOne({ _id: new ObjectId(id) });
  
      if (result.deletedCount == 1) {
        console.log('deleted');
      } else {
        console.log('not found');
      }
  
      return res.status(OK).json(result);
    } catch (error) {
      return res.status(BAD_REQUEST).json({ error: 'Failed to delete report' });
    }
};

module.exports = reportController;