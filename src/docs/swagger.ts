import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: { title: 'Review Kantin API', version: '1.0.0' },
  servers: [{ url: 'http://localhost:3000' }],
  definitions: {
    StallInput: {
      type: 'object',
      required: ['ownerId', 'name'],
      properties: {
        ownerId: { type: 'integer', example: 2 },
        name: { type: 'string', example: 'Warung Baru' },
        category: { type: 'string', example: 'Nasi' },
        location: { type: 'string', example: 'Kantin FK' },
        description: { type: 'string' },
      },
    },
  },
};

const outputFile = './src/docs/swagger-output.json';   // <- ini yang diganti
const endpointsFiles = ['./src/index.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc);