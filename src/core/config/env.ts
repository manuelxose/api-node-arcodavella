import * as dotenv from "dotenv";

dotenv.config();

export const env = {
  jwtSecret: process.env.JWT_SECRET || "defaultsecret",
  mongodbUri: process.env.MONGO_URL || "mongodb://localhost:27017/authDB",
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  dbName: process.env.MONGO_DB_NAME || "default",
  emailUser: process.env.IONOS_EMAIL_USER,
  emailPass: process.env.IONOS_EMAIL_PASS,
  emailHost: process.env.IONOS_SMTP_HOST,
  emailPort: process.env.IONOS_SMTP_PORT,
};
