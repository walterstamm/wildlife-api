const express = require('express');
const app = express();
const router = express.Router();
// Why do we have this router thing here?
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const route = require('./routes');
const mongoDb = require('./database/data');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('API is running\n <p><a href="http://localhost:8080/api-docs/">API Docs</a></p>');
});

app.use('/', route);

mongoDb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => console.log(`Running on port ${port}`));
  }
});
