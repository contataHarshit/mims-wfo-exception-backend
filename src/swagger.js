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
      schemas: {
        BasicEmployee: {
          type: "object",
          properties: {
            EmployeeId: { type: "integer" },
            EmployeeNumber: { type: "string" },
            FirstName: { type: "string" },
            LastName: { type: "string" },
          },
        },
        EmployeeProfile: {
          type: "object",
          properties: {
            employeeId: { type: "integer" },
            employeeName: { type: "string" },
            managerName: {
              type: ["object", "null"],
              properties: {
                EmployeeId: { type: "integer" },
                name: { type: "string" },
              },
            },
            projects: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  name: { type: "string" },
                },
              },
            },
          },
        },
        ExceptionRequest: {
          type: "object",
          properties: {
            id: { type: "integer" },
            exceptionStartDate: { type: "string", format: "date" },
            exceptionEndDate: { type: "string", format: "date" },
            primaryReason: { type: "string" },
            exceptionRequestedDays: { type: "integer" },
            exceptionApprovedDays: { type: "integer", nullable: true },
            currentStatus: { type: "string" },
            managerRemarks: { type: "string", nullable: true },
            action: { type: "string" },
            submissionDate: { type: "string", format: "date-time" },
            updatedDate: { type: "string", format: "date-time" },
            employeeName: { type: "string" },
            projectName: { type: "string" },
            managerName: { type: "string" },
          },
        },
        ExceptionCreateRequest: {
          type: "object",
          required: [
            "exceptionDateRange",
            "primaryReason",
            "submissionDate",
            "exceptionRequestedDays",
            "action",
            "employee",
            "manager",
            "project",
          ],
          properties: {
            exceptionDateRange: {
              type: "string",
              example: "2025-10-14 to 2025-10-20",
            },
            primaryReason: { type: "string", example: "Family emergency" },
            submissionDate: {
              type: "string",
              format: "date",
              example: "2025-10-13",
            },
            exceptionRequestedDays: { type: "integer", example: 5 },
            action: { type: "string", example: "CREATE" },
            employee: { type: "integer", example: 123 },
            manager: { type: "integer", example: 456 },
            project: { type: "integer", example: 789 },
          },
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
