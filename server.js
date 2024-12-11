const express = require('express');
const app = express();

// Serve static files from the "utilities" directory
app.use('/utilities', express.static('utilities'));

const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const apiDocsRoute = require('./routes/api-docs');
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

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: `Something went wrong while querying ${req.originalUrl}`, 
  });
});

app.get('/', (_req, res) => {
  res.send(`
    <html>
      <head>
        <link rel="stylesheet" type="text/css" href="/utilities/styles.css">
      </head>
      <body>
        <img src="/utilities/green-check-mark.png" alt="Wildlife Observation API" class="api-status">
        <h1>API is running</h1>
        <p>Welcome to the Wildlife Observation API</p>
        <p><a href="${process.env.MAIN_SCHEME}://${process.env.HOST}/api-docs">Go to the API docs</a></p>
      </body>
    </html>
  `);
});


// Protect all routes with rate limiter to prevent abuse
app.use('/', limiter);
app.use('/', routes);
app.use('/api-docs', apiDocsRoute);

mongoDb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => console.log(`Running on port ${port}`));
  }
});
