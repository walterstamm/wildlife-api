const express = require('express');
const app = express();
const router = express.Router();
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const route = require('./routes');
const mongoDb = require('./database/data')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('API is running');
});

app.use('/', route);

mongoDb.initDb((err) => {
    if (err) {
      console.log(err);
    } else {
      app.listen(port, () => console.log(`Running on port ${port}`));
    }
  });