// All settings from .env in one place. Stop the server early if a required one is missing.
const required = ['DATABASE_URL', 'JWT_SECRET'];

for (const name of required) {
  if (!process.env[name]) {
    throw new Error(`Missing ${name} in .env`);
  }
}

export const env = {
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  isProduction: process.env.NODE_ENV === 'production',
};
