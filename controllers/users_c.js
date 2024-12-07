const db = require('../database/data');
const userController = {};

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
  const { fname, lname, email, username, password, state, country } = req.body;

  try {
    const database = await db.getDatabase();
    const userCollection = database.db('WildlifeAPI').collection('Users');
    const hashedPassword = await bcrypt.hash(password);

    const result = await userCollection.insertOne({
      fname,
      lname,
      email,
      username,
      password: hashedPassword,
      state,
      country
    });

    return result;
  } catch (error) {
    console.error('error adding user - ', error);
  }
};
// - GET/auth/login
// - GET/auth/logout
// - GET /users/
// - GET /users/:username
// - PUT /users/:username

userController.editUserByName = async function (req, res) {
  const usernameEdit = req.params.username;

  // So, I'm not trying to copy the POST thing for users, but they're pretty similar in how they're sent.
  // I'll try my best to make it my own and fit to the standard we have, but I think in a real world situation,
  // that would be less than ideal. Keeping similar systems similar is a good idea to me. -L.C.

  const userEdits = {
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    state: req.body.state,
    country: req.body.country
  };

  try {
    const database = await db.getDatabase();
    const userCollection = database.db('WildlifeAPI').collection('Users');
    const passwordEdit = await bcrypt.hash(req.params.password);

    const result = await userCollection.replaceOne({ username: usernameEdit }, userEdits);
    return result;
  } catch (error) {
    console.log('Error editing user!', error);
  }
};

// - DELETE /users/:username
userController.deleteUserByName = async function (req, res) {
  const username = req.params.username;
  try {
    const database = await db.getDatabase();
    const userCollection = database.db('WildlifeAPI').collection('Users');

    const result = await userCollection.deleteOne({ username: username });

    if (result.deletedCount == 1) {
      console.log('deleted');
    } else {
      console.log('not found');
    }
  } catch (error) {
    console.error('error deleting user - ', error);
  }
};

module.exports = userController;
