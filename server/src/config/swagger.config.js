export default {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'openfoam-api',
        version: '1.0.0',
      },
      basePath: '/api',
      servers: [
        {
          url: 'http://localhost:3000/api/',
        },
      ],
    },
    apis: [
      "src/api/controllers/generateMesh.js",
      "src/api/controllers/files/*.js",
    ]
  };