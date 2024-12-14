const { StatusCodes } = require('http-status-codes');
const db = require('../database/data');
const ObjectId = require('mongodb').ObjectId;
const userController = {};

userController.getAllUsers = async function (req, res) {
  // #swagger.tags = ['Users']
  // #swagger.responses[200] = {description: "Success"}
  // #swagger.responses[500] = {description: "Internal Server Error"}
  try {
    const result = await db.getDatabase().db('WildlifeAPI').collection('Users').find();
    result.toArray().then((users) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(StatusCodes.OK).json(users);
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// - GET /users/:id
userController.getUserById = async function (req, res) {
  // #swagger.tags = ['Users']
  // #swagger.responses[200] = {description: "Success"}
  // #swagger.responses[500] = {description: "Internal Server Error"}
  const targetString = String(req.params.id);
  const target = new ObjectId(targetString);
  try {
    const result = await db
      .getDatabase()
      .db('WildlifeAPI')
      .collection('Users')
      .find({ username: target });
    result.toArray().then((users) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(StatusCodes.OK).json(users);
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// - POST/PUT /users/:id
userController.createOrUpdateUser = async function (req, res) {
  // #swagger.tags = ['Users']
  // #swagger.responses[200] = {description: "Success"}
  // #swagger.responses[201] = {description: "Created"}
  // #swagger.responses[500] = {description: "Internal Server Error"}
  const userId = req.params?.id
    ? ObjectId.createFromHexString(Number(req.params.id))
    : null

  const {
    githubId,
    username,
    displayName,
    profileUrl,
  } = req.body;

  try {
    const database = await db.getDatabase();
    const userCollection = database.db('WildlifeAPI').collection('Users');

    const userEdits = {
      githubId,
      username,
      displayName,
      profileUrl,
    };

    const result = await userCollection.updateOne(
      { _id: userId },
      { $set: userEdits },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      console.log('New user created');
      return res.status(StatusCodes.CREATED).json(result);
    }
    if (result.modifiedCount > 0) {
      console.log('User updated');
      return res.status(StatusCodes.OK).json(result);
    }
  } catch (error) {
    console.log('Error editing user!', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// - DELETE /users/:id 
userController.deleteUserById = async function (req, res) {
  // #swagger.tags = ['Users']
  // #swagger.responses[200] = {description: "Success"}
  // #swagger.responses[500] = {description: "Internal Server Error"}
  const id = req.params.id;
  try {
    const database = await db.getDatabase();
    const userCollection = database.db('WildlifeAPI').collection('Users');

    const result = await userCollection.deleteOne({ _id: ObjectId.createFromHexString(Number(id)) });

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

module.exports = userController;
