const db = require('../database/data');
const ObjectId = require('mongodb').ObjectId;

const handleErrors = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const idInDatabase = async function (id, collectionName) {
  try {
    const database = await db.getDatabase();

    const idString = String(id);
    const target = new ObjectId(idString);

    const collection = database.db('WildlifeAPI').collection(collectionName);
    const matches = await collection.countDocuments({ _id: target });
    return matches > 0;
  } catch {
    return false;
  }
};

module.exports = { handleErrors, idInDatabase };
