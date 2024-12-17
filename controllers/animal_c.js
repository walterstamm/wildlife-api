const { StatusCodes } = require('http-status-codes');
const db = require('../database/data');
const ObjectId = require('mongodb').ObjectId;
const animalController = {};

// Animal Endpoints:
// - GET /animals

animalController.getAllAnimals = async function (req, res) {
  // #swagger.tags = ['Animals']
  // #swagger.responses[200] = {description: "Success"}
  // #swagger.responses[500] = {description: "Internal Server Error"}
  try {
      const result = await db.getDatabase().db('WildlifeAPI').collection('Animals').find();
      const animals = await result.toArray(); // Asegúrate de esperar la conversión a array
      res.setHeader('Content-Type', 'application/json');
      res.status(StatusCodes.OK).json(animals);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'There was an error retrieving animals.',
      error: error.message 
    });
  }
};

// - GET /animals/:id
animalController.getOneAnimal = async function (req, res) {
  // #swagger.tags = ['Animals']
  // #swagger.responses[200] = {description: "Success"}
  // #swagger.responses[500] = {description: "Internal Server Error"}
  const targetString = String(req.params.id);
  const target = new ObjectId(targetString);
  try {
    const result = await db
      .getDatabase()
      .db('WildlifeAPI')
      .collection('Animals')
      .find({ _id: target });
    result.toArray().then((animals) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(StatusCodes.OK).json(animals);
    });
  } catch {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'There was an error retrieving the animal.'
    });
  }
};

// - GET /animals/by-category/:category
animalController.getAnimalsByCategory = async function (req, res) {
  // #swagger.tags = ['Animals']
  // #swagger.responses[200] = {description: "Success"}
  // #swagger.responses[500] = {description: "Internal Server Error"}
  const target = req.params.category;
  try {
    const result = await db
      .getDatabase()
      .db('WildlifeAPI')
      .collection('Animals')
      .find({ category: target });
    result.toArray().then((animals) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(StatusCodes.OK).json(animals);
    });
  } catch {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'There was an error retrieving animals by category.'
    });
  }
};

// - POST /animals
// Example ↓↓
// example website URL -> https://kids.nationalgeographic.com/animals/mammals/facts/aardvark
// category: 'Mammals'
// common_name: 'Aardvarks'
// scientific_name: 'Orycteropus afer'
// diet: 'Insectivore'
// avg_lifespan_year: 23,
// avg_size_cm: 166,
// avg_weight_kg: 34
animalController.addAnimal = async function (req, res) {
  // #swagger.tags = ['Animals']
  // #swagger.responses[200] = {description: "Success"}
  // #swagger.responses[500] = {description: "Internal Server Error"}
  const {
    category,
    common_name,
    scientific_name,
    diet,
    avg_lifespan_year,
    avg_size_cm,
    avg_weight_kg
  } = req.body;

  try {
    const database = await db.getDatabase();
    const animalCollection = database.db('WildlifeAPI').collection('Animals');

    const result = await animalCollection.insertOne({
      category,
      common_name,
      scientific_name,
      diet,
      avg_lifespan_year,
      avg_size_cm,
      avg_weight_kg
    });

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ messasge: error.message });
  }
};

// - PUT /animals/:id
animalController.editAnimalById = async function (req, res) {
  // #swagger.tags = ['Animals']
  // #swagger.responses[200] = {description: "Success"}
  // #swagger.responses[500] = {description: "Internal Server Error"}
  const animalId = ObjectId.createFromHexString(req.params.id);

  try {
    const database = await db.getDatabase();
    const animalCollection = database.db('WildlifeAPI').collection('Animals');

    const animalEdits = {
      category: req.body.category,
      common_name: req.body.common_name,
      scientific_name: req.body.scientific_name,
      diet: req.body.diet,
      avg_lifespan_year: req.body.avg_lifespan_year,
      avg_size_cm: req.body.avg_size_cm,
      avg_weight_kg: req.body.avg_weight_kg
    };

    const result = await animalCollection.replaceOne({ _id: animalId }, animalEdits);
    if (result.modifiedCount) {
      console.log('Database modified');
    } else {
      console.log('Database not modified');
    }
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    console.log('Error editing animal!', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to edit animal.'
    });
  }
};

// - DELETE /animals/:id
animalController.deleteAnimalById = async function (req, res) {
  // #swagger.tags = ['Animals']
  // #swagger.responses[200] = {description: "Success"}
  // #swagger.responses[500] = {description: "Internal Server Error"}
  const id = req.params.id;
  try {
    const database = await db.getDatabase();
    const animalCollection = database.db('WildlifeAPI').collection('Animals');

    const result = await animalCollection.deleteOne({ _id: ObjectId.createFromHexString(id) });

    if (result.deletedCount == 1) {
      console.log('deleted');
    } else {
      console.log('not found');
    }

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

module.exports = animalController;
