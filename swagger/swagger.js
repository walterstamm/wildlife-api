const dotenv = require('dotenv');
const swaggerAutogen = require('swagger-autogen')();

dotenv.config();

const doc = {
  info: {
    title: 'Wildlife Observation API',
    description: 'API for wildlife observation',
  },
  host: process.env.HOST,
  produces: ['application/json'],
  schemes: [process.env.MAIN_SCHEME],
};

const outputFile = './swagger-output.json';

const routes = [
  '../routes/animal_r.js',
  // '../routes/observation_r.js',
  // '../routes/report_r.js',
  '../routes/user_r.js'
];

swaggerAutogen(outputFile, routes, doc);
