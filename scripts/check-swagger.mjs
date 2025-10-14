import swaggerJSDoc from "swagger-jsdoc";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "wfme", version: "1.0.0" },
    servers: [{ url: `http://localhost:${process.env.PORT || 3000}` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    path.join(process.cwd(), "src", "routes", "*.js"),
    path.join(process.cwd(), "src", "controller", "*.js"),
  ],
};

try {
  const spec = swaggerJSDoc(options);
  console.log("paths:", Object.keys(spec.paths || {}));
} catch (err) {
  console.error("ERR", err);
  process.exit(1);
}
