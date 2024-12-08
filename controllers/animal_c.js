const db = require('../database/data');
const ObjectId = require('mongodb').ObjectId;
const animalController = {};

// Animal Endpoints:
// - GET /animals

animalController.getAllAnimals = async function (req, res) {
  try {
    const result = await db.getDatabase().db('WildlifeAPI').collection('Animals').find();
    result.toArray().then((animals) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(animals);
    });
  } catch {
    res.status(500).send('There was an error retrieving animals.');
  }
};

// - GET /animals/:id

animalController.getOneAnimal = async function (req, res) {
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
      res.status(200).json(animals);
    });
  } catch {
    res.status(500).send('There was an error retrieving animals.');
  }
};

// - GET /animals/by-category/:category

animalController.getAnimalsByCategory = async function (req, res) {
  const target = req.params.category;
  try {
    const result = await db.getDatabase().db('WildlifeAPI').collection('Animals').find();
    result.toArray().then((animals) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(animals);
    });
  } catch {
    res.status(500).send('There was an error retrieving animals.');
  }
};

// - POST /animals
// Example ↓↓
// example website URL -> https://kids.nationalgeographic.com/animals/mammals/facts/aardvark
// category: 'Mammals'
// common_name: 'Aardvarks'
// scientific_name: 'Orycteropus afer'
// diet: 'Insectivore'
animalController.addAnimal = async function (req, res) {
  const { category, common_name, scientific_name, diet } = req.body;

  try {
    const database = await db.getDatabase();
    const animalCollection = database.db('WildlifeAPI').collection('Animals');

    const result = await animalCollection.insertOne({
      category,
      common_name,
      scientific_name,
      diet
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add animal' });
  }
};

// - PUT /animals/:id

animalController.editAnimalById = async function (req, res) {
  const animalId = new ObjectId(req.params.id);

  try {
    const database = await db.getDatabase();
    const animalCollection = database.db('WildlifeAPI').collection('Animals');

    const animalEdits = {
      category: req.body.category,
      common_name: req.body.common_name,
      scientific_name: req.body.scientific_name,
      diet: req.body.diet
    };

    const result = await animalCollection.replaceOne({ _id: animalId }, animalEdits);
    if (result.modifiedCount) {
      console.log('Database modified');
    } else {
      console.log('Database not modified');
    }
    return res.status(200).json(result);
  } catch (error) {
    console.log('Error editing animal!', error);
    return res.status(500).json('500 Error!');
  }
};

// - DELETE /animals/:id
animalController.deleteAnimalById = async function (req, res) {
  const id = req.params.id;
  try {
    const database = await db.getDatabase();
    const animalCollection = database.db('WildlifeAPI').collection('Animals');

    const result = await animalCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount == 1) {
      console.log('deleted');
    } else {
      console.log('not found');
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete animal' });
  }
};

module.exports = animalController;
