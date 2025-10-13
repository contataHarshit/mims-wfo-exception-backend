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
  },
  // Use absolute paths so swagger-jsdoc finds files when run from different CWDs
  apis: [
    `${process.cwd()}/src/routes/*.js`,
    `${process.cwd()}/src/controller/*.js`,
  ],
};

const swaggerSpec = swaggerJSDoc(options);

// If swagger-jsdoc failed to discover any paths, provide a small fallback
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

const merged = { ...swaggerSpec };
merged.paths = Object.keys(swaggerSpec.paths || {}).length
  ? swaggerSpec.paths
  : fallbackPaths;

export default merged;
