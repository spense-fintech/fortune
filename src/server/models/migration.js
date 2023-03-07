import * as dotenv from "dotenv";
dotenv.config();
import mysql from "mysql2";
import migration from "mysql-migrations";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pool = mysql.createPool({
  connectionLimit: 1,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  charset: "utf8mb4",
  timezone: "+00:00",
});
migration.init(pool, __dirname + "/migrations", function () {
  console.log("finished running migrations");
});
