import dotenv from 'dotenv';

dotenv.config();

export function env(name, defaultValue) {
  const value = process.env[name];

  if (value) return value;

  if (defaultValue) return defaultValue;

  throw new Error(`Missing: process.env['${name}'].`);
}

const PORT = env('PORT', 8080);
const MONGODB_USER = env('MONGODB_USER');
const MONGODB_PASSWORD = env('MONGODB_PASSWORD');
const MONGODB_URL = env('MONGODB_URL');
const MONGODB_DB = env('MONGODB_DB');

export { PORT, MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB };
