const { StatusCodes } = require('http-status-codes');
const db = require('../database/data');
const ObjectId = require('mongodb').ObjectId;
const userController = {};
const bcrypt = require('bcrypt');

// Users Endpoints:
// - POST /auth/signup
// Example ↓↓
// fname: 'John',
// lname: 'Doe',
// email: 'JD@test.com',
// username: 'JD',
// password: '123',
// state: 'Utah',
// country: 'USA'
userController.addUser = async function (req, res) {
  // #swagger.tags = ['Users']
  // #swagger.responses[200] = {description: "Success"}
  // #swagger.responses[500] = {description: "Internal Server Error"}
  const { fname, lname, email, username, password, state, country } = req.body;

  try {
    const database = await db.getDatabase();
    const userCollection = database.db('WildlifeAPI').collection('Users');
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await userCollection.insertOne({
      fname,
      lname,
      email,
      username,
      password: hashedPassword,
      state,
      country
    });

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to add user' });
  }
};
// - GET/auth/login *This endpoint goes through a different router, should it be in a different controller?
// - GET/auth/logout*This endpoint goes through a different router, should it be in a different controller?
// - GET /users/

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
  } catch {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('There was an error retrieving users.');
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
  } catch {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('There was an error retrieving users.');
  }
};
// - PUT /users/:id

userController.editUserById = async function (req, res) {
  // #swagger.tags = ['Users']
  // #swagger.responses[200] = {description: "Success"}
  // #swagger.responses[500] = {description: "Internal Server Error"}
  const userId = new ObjectId(req.params.id);

  //   this is stupid but it works so I'm StatusCodes.OKay with it -L.C.
  const { password } = req.body;

  // So, I'm not trying to copy the POST thing for users, but they're pretty similar in how they're sent.
  // I'll try my best to make it my own and fit to the standard we have, but I think in a real world situation,
  // that would be less than ideal. Keeping similar systems similar is a good idea to me. -L.C.

  try {
    const database = await db.getDatabase();
    const userCollection = database.db('WildlifeAPI').collection('Users');
    const hashedPassword = await bcrypt.hash(password, 10);

    const userEdits = {
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
      state: req.body.state,
      country: req.body.country
    };

    const result = await userCollection.replaceOne({ _id: userId }, userEdits);
    if (result.modifiedCount) {
      console.log('Database modified');
    } else {
      console.log('Database not modified');
    }
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    console.log('Error editing user!', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json('500 Error!');
  }
};

// - DELETE /users/:id (This is a change, Yun please update the function to target by id)
userController.deleteUserById = async function (req, res) {
  // #swagger.tags = ['Users']
  // #swagger.responses[200] = {description: "Success"}
  // #swagger.responses[500] = {description: "Internal Server Error"}
  const id = req.params.id;
  try {
    const database = await db.getDatabase();
    const userCollection = database.db('WildlifeAPI').collection('Users');

    const result = await userCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount == 1) {
      console.log('deleted');
    } else {
      console.log('not found');
    }
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to delete user' });
  }
};

module.exports = userController;
