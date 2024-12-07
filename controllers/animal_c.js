const db = require('../database/data');
const animalController = {};

// Animal Endpoints:
// - GET /animals
// - GET /animals/:id
// - GET /animals/by-category/:category
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
        const animalCollection = database.db().collection('animal');

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
        const animalCollection = database.db().collection('animal');

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
