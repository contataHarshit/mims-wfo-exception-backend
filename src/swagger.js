import dotenv from "dotenv";
import swaggerJSDoc from "swagger-jsdoc";

dotenv.config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WFME Project API",
      version: "1.0.0",
      description: "API documentation for WFME Project",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    // Apply bearerAuth globally to all endpoints by default
    security: [{ bearerAuth: [] }],
  },
  apis: [
    // Make sure these paths point to where your JSDoc comments are
    `${process.cwd()}/src/routes/*.js`,
    `${process.cwd()}/src/controller/*.js`,
  ],
};

const swaggerSpec = swaggerJSDoc(options);

// Fallback paths if no JSDoc paths were found (prevents empty docs)
const fallbackPaths = {
  "/api/exception-requests": {
    get: {
      summary: "Get exception requests (fallback)",
      responses: { "200": { description: "OK" } },
    },
    post: {
      summary: "Create an exception request (fallback)",
      responses: { "201": { description: "Created" } },
    },
  },
  "/api/exception-requests/{id}": {
    put: {
      summary: "Update exception request (fallback)",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer" } },
      ],
      responses: { "200": { description: "Updated" } },
    },
  },
};

// Use swagger-jsdoc generated paths if available, otherwise fallback
const merged = {
  ...swaggerSpec,
  paths: Object.keys(swaggerSpec.paths || {}).length
    ? swaggerSpec.paths
    : fallbackPaths,
};

export default merged;
