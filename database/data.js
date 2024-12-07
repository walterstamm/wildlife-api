const {MongoClient} = require('mongodb');
const dbConfig = {};

const uri = process.env.MONGO_CONNECT;
const client = new MongoClient(uri);

dbConfig.connectDB = async function () {
    try {

        await client.connect();

        const db = client.db('');
        return db

    } catch (error) {
        console.error('failed to connect to the db - ', error);

    } 
}

module.exports = dbConfig;