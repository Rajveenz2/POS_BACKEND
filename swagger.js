const swaggerAutogen = require('swagger-autogen')()
const config = require('./config/settings');

const doc = {
  info: {
    title: 'izc-dashboard-backend',
    description: 'Backend Documentation for Buyer Dashboard',
  },
  host: `localhost:${config.express.port}`,
  schemes: ['http'],
  securityDefinitions: {
    Bearer: {
      name: 'Authorization',
      type: 'apiKey',
      in: 'header',
      description: 'User\'s Bearer Token'
    },
    apiKey: {
      name: 'Authorization',
      type: 'apiKey',
      in: 'header',
      description: 'Application\'s Api-Key'
    },
    apiPassCode: {
      name: 'passcode',
      type: 'apiKey',
      in: 'header',
      description: 'Application\'s Passcode'
    }
  },
};

const outputFile = './swagger_output.json'
const endpointsFiles = ['./routes/routes.js']

swaggerAutogen(outputFile, endpointsFiles, doc)