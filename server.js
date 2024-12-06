const express = require('express');
const app = express();
const router = express.Router();
const port = 8080;
const bodyParser = require('body-parser');
const route = require('./routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('API is running');
});

app.use('/api', route);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});