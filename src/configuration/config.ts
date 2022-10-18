require('dotenv').config();

export const Env = {
  DatabasePassword: process.env.DATABASE_PASS,
  SecretKey: process.env.SECRET_KEY,
};
