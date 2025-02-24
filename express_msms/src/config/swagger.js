const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express API with Swagger",
      version: "1.0.0",
      description: "API documentation using Swagger in Express.js",
    },
    servers: [
      {
        url: "http://localhost:8080", // Change based on your environment
        description: "Local server",
      },
    ],
    components: {
      schemas: {
        CustomerDto: {
          type: "object",
          required: [
            "name",
            "contact",
            "outstandingAmount",
            "dueDate",
            "status",
          ],
          properties: {
            name: {
              type: "string",
              minLength: 1,
              example: "John Doe",
              description: "Name must be a non-empty string.",
            },
            name: {
              type: "string",
              minLength: 1,
              example: "John Doe",
              description: "Name must be a non-empty string.",
            },
            contact: {
              type: "string",
              minLength: 1,
              example: "+1234567890",
              description: "Contact must be a non-empty string.",
            },
            outstandingAmount: {
              type: "number",
              minimum: 0,
              example: 100.5,
              description: "Must be a number greater than or equal to 0.",
            },
            dueDate: {
              type: "string",
              format: "date",
              example: "2024-12-31",
              description: "Must be a valid future date.",
            },
            status: {
              type: "string",
              enum: ["Paid", "Pending", "Overdue"],
              example: "Pending",
              description: "Must be one of: Paid, Pending, Overdue.",
            },
          },
        },
        Customer: {
          type: "object",
          required: [
            "name",
            "contact",
            "outstandingAmount",
            "dueDate",
            "status",
          ],
          properties: {
            id: {
              type: "string",
              minLength: 1,
              example: "XXXXX",
              description: "ID must be a non-empty string.",
            },
            name: {
              type: "string",
              minLength: 1,
              example: "John Doe",
              description: "Name must be a non-empty string.",
            },
            contact: {
              type: "string",
              minLength: 1,
              example: "+1234567890",
              description: "Contact must be a non-empty string.",
            },
            outstandingAmount: {
              type: "number",
              minimum: 0,
              example: 100.5,
              description: "Must be a number greater than or equal to 0.",
            },
            dueDate: {
              type: "string",
              format: "date",
              example: "2024-12-31",
              description: "Must be a valid future date.",
            },
            status: {
              type: "string",
              enum: ["Paid", "Pending", "Overdue"],
              example: "Pending",
              description: "Must be one of: Paid, Pending, Overdue.",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"], // Path to API route files
};

const specs = swaggerJsdoc(options);
module.exports = specs;
