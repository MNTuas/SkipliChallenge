const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Skipli Challenge API',
      version: '1.0.0',
    },
  },
  apis: ['./server.js'], // nơi có comment mô tả API
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
