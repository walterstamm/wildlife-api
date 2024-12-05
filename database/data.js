const {MongoClient} = require('mongodb');
const dbConfig = {};

const uri = process.env.CONNECT_STRING;
const client = new MongoClient(uri);

dbConfig.connectDB = async function () {
    try {

        await client.connect();

        const db = client.db('database name here');
        return db

    } catch (error) {
        console.error('failed to connect to the db - ', error);

    } 
}

module.exports = dbConfig;