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
  tags: [
    {
      name: 'General',
      description: 'Endpoints for general operations like login and logout',
    },
    {
      name: 'Animals',
      description: 'Endpoints for animals in the database',
    },
    {
      name: 'Users',
      description: 'Endpoints for users in the database',
    },
    {
      name: 'Observations',
      description: 'Endpoints for observations in the database',
    },
    {
      name: 'Reports',
      description: 'Endpoints for reports in the database',
    },
  ],
  schemes: [process.env.MAIN_SCHEME],
};

const outputFile = './swagger-output.json';

const routes = [
  '../routes/index.js'
];

swaggerAutogen(outputFile, routes, doc);

