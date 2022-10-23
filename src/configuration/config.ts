require('dotenv').config();

export const Env = {
  DatabasePassword: process.env.DATABASE_PASS,
  DBUser: process.env.DATABASE_USER,
  DBHost: process.env.DATABASE_HOST,
  DatabseName: process.env.DATABASE_DATABASE,
  SecretKey: process.env.SECRET_KEY,
};
