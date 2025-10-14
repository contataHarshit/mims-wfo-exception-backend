import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mssql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  debug: true,
  logging: ["query", "error"], // Enable query and error logging
  entities: ["./src/entity/*.js"],
  options: {
    encrypt: true, // required for Azure; usually safe to leave true
    trustServerCertificate: true, // allow self-signed certs (for local dev)
  },
});
