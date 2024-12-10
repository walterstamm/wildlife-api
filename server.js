const express = require('express');
const app = express();

const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const route = require('./routes');
const mongoDb = require('./database/data');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP address. Please try again after an hour.',
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to handle errors

app.use((err, req, res, next) => {
  console.error(err.stack); // Print error in the console
  res.status(500).json({ message: 'Something went wrong!' }); // Answer to the client
});

app.get('/', (req, res) => {
  res.send('API is running\n <p><a href="http://localhost:8080/api-docs/">API Docs</a></p>');
});

// Protect all routes with rate limiter to prevent abuse
app.use('/', limiter);
app.use('/', route);

mongoDb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => console.log(`Running on port ${port}`));
  }
});
