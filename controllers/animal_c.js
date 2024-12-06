const db = require('../database/data');
const animalController = {};

// Animal Endpoints:
// - GET /animals
// - GET /animals/:id
// - GET /animals/by-category/:category
// - POST /animals
    // Example ↓↓
    // category: 'Omnivores',
    // name: 'cat'
animalController.addAnimal = async function(req, res){
    const {category, name} = req.body;

    try {
        const database = await db.connectDB();
        const animalCollection = database.collection('animal');

        const result = await animalCollection.insertOne({
            category,
            name
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
        const database = await db.connectDB();
        const animalCollection = database.collection('animal');

        const result = await animalCollection.deleteOne({id: id});

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
