const express = require('express');
const app = express();
const router = express.Router();
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const route = require('./routes');
const mongoDb = require('./database/data')

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP address. Please try again after an hour.',
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('API is running');
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