const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Wildlife API Swagger Testing',
    description: 'This is the Swagger Autogen documentation for the Wildlife API.'
  },
  host: 'localhost:8080',
  schemes: ['http', 'https']
};
const outputFile = './swagger.json';
const routes = ['./routes/index.js', './routes/user_r.js', './routes/animal_r.js'];

swaggerAutogen(outputFile, routes, doc).then(() => {
  require('./server.js');
});
