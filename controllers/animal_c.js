const db = require('../database/data');
const ObjectId = require('mongodb').ObjectId;
const animalController = {};

// Animal Endpoints:
// - GET /animals

animalController.getAllAnimals = async function (req, res) {
    try{
        const result = await db.getDatabase.db('WildlifeAPI').collection('Animals').find();
        result.toArray().then((animals) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(animals);
        })
    } catch {
        console.log(`animals/getAll error: ${error}`)
        res.status(500).send('There was an error retrieving animals.');
    }
}

// - GET /animals/:id

animalController.getOneAnimal = async function (req, res) {
    const targetString = String(req.params.id);
    const target = new ObjectId(targetString);
    try{
        const result = await db.getDatabase.db('WildlifeAPI').collection('Animals').find({_id: target});
        result.toArray().then((animals) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(animals);
        })
    } catch {
        console.log(`animals/getOne error: ${error}`)
        res.status(500).send('There was an error retrieving animals.');
    }
}

// - GET /animals/by-category/:category

animalController.getAnimalsByCategory = async function (req, res) {
    const target = req.params.category
    try{
        const result = await db.getDatabase.db('WildlifeAPI').collection('Animals').find();
        result.toArray().then((animals) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(animals);
        })
    } catch {
        console.log(`animals/by-category error: ${error}`)
        res.status(500).send('There was an error retrieving animals.');
    }
}

// - POST /animals
    // Example ↓↓
    // example website URL -> https://kids.nationalgeographic.com/animals/mammals/facts/aardvark
    // category: 'Mammals'
    // common_name: 'Aardvarks'
    // scientific_name: 'Orycteropus afer' 
    // diet: 'Insectivore'
animalController.addAnimal = async function(req, res){
    const {category, common_name, scientific_name, diet} = req.body;

    try {
        const database = await db.getDatabase();
        const animalCollection = database.db('WildlifeAPI').collection('Animals');

        const result = await animalCollection.insertOne({
            category,
            common_name,
            scientific_name,
            diet
        });

        return result;        

    } catch (error) {
        console.error('error adding animal - ', error);        
    }
}

// - PUT /animals/:id

// - DELETE /animals/:id
animalController.deleteAnimalById = async function(req, res){
    const id = req.params.id;
    try {
        const database = await db.getDatabase();
        const animalCollection = database.db('WildlifeAPI').collection('Animals');

        const result = await animalCollection.deleteOne({_id: id});

        if(result.deletedCount == 1){
            console.log('deleted');
        }else{
            console.log('not found');
        }
        
    } catch (error) {
       console.error('error deleting animal - ', error); 
    }
}


module.exports = animalController;
