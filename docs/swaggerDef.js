const { version } = require("../package.json");
const config = require("../config/config");

const swaggerDef = {
  openapi: "3.0.0",
  info: {
    title: "PSR API documentation",
    version,
    license: {
      name: "MIT",
      url: "https://github.com/hagopj13/node-express-boilerplate/blob/master/LICENSE",
    },
  },
  servers: [
    {
      url: `${config.apiUrl}/api/v1`,
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT", // Optional: Indicates that the token is a JWT
      },
    },
  },
  security: [
    {
      bearerAuth: [], // Apply this scheme globally to all routes
    },
  ],
};

module.exports = swaggerDef;
