
const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fleet Transport Management API",
      version: "1.0.0",
      description:
        "REST API for managing trucks, trailers, tires, trips, and maintenance.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local Docker API",
      },
    ],
    tags: [
      { name: "Authentication" },
      { name: "Camions" },
      { name: "Remorques" },
      { name: "Pneus" },
      { name: "Trajets" },
      { name: "Maintenances" },
      { name: "Maintenance Rules" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Resource not found" },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, "../routes/*.js")],
};

module.exports = swaggerJsdoc(options);
