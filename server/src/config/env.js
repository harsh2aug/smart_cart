// All settings from .env in one place. Stop the server early if a required one is missing.
const isProduction = process.env.NODE_ENV === 'production';

const required = ['DATABASE_URL', 'JWT_SECRET'];
if (isProduction) {
  required.push('BREVO_API_KEY', 'MAIL_FROM_EMAIL'); // real emails are a must when live
}

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
  BREVO_API_KEY: process.env.BREVO_API_KEY, // empty in development = print emails in the terminal
  MAIL_FROM_EMAIL: process.env.MAIL_FROM_EMAIL,
  MAIL_FROM_NAME: process.env.MAIL_FROM_NAME || 'SmartCart',
  isProduction,
};
