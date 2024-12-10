const db = require('../database/data');
const ObjectId = require('mongodb').ObjectId;
const observationController = {};

// Observation Endpoints:
// - GET /observations
// - GET /observation/:id
// - GET /observations/by-animal/:animal-id
// - GET /observations/by-user/:username

// - POST /observations
// Example ↓↓
// animal_id
// age: 'juvenile, adolescent, adult, elderly'
// gender: 'male, female, and unknown'
// behavior: 'playing, hunting, sleeping...'
observationController.addObservation = async function (req, res) {
    const {animal_id, age, gender, behavior} = req.body;
  
    try {
      const database = await db.getDatabase();
      const observationCollection = database.db('WildlifeAPI').collection('Observations');
  
      const result = await observationCollection.insertOne({
        animal_id,
        age,
        gender,
        behavior
      });
  
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to add observation' });
    }
}

// - PUT /observations/:id

// - DELETE /observations/:id
observationController.deleteObservationById = async function (req, res) {
    const id = req.params.id;
    try {
      const database = await db.getDatabase();
      const observationCollection = database.db('WildlifeAPI').collection('Observations');
  
      const result = await observationCollection.deleteOne({ _id: new ObjectId(id) });
  
      if (result.deletedCount == 1) {
        console.log('deleted');
      } else {
        console.log('not found');
      }
  
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete observation' });
    }
}
  
module.exports = observationController;