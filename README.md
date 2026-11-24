# SmartCart

QR-code ordering for street food carts. A vendor signs up, sets up their cart, and customers will scan a QR code to see the menu and order from their phone.

Built mobile-first: vendors use it on their smartphones.

> **Status:** in active development. Vendor accounts and profiles work today; the menu, QR ordering and live orders are coming next.

## Features so far

- Vendor sign-up and login with mobile number and password
- Email verification with a 6-digit code (OTP)
- Forgot password with an email code
- Vendor profile: cart name, description, address and city
- Open / Closed switch for the cart
- Security: hashed passwords, login token in an httpOnly cookie, input validation on every request, rate limiting on login and email codes

## Tech stack

| Part     | Tools                                                    |
| -------- | -------------------------------------------------------- |
| Frontend | React 19, Vite, Tailwind CSS v4, React Router            |
| Backend  | Node.js, Express 5, Zod, JWT, bcrypt, express-rate-limit |
| Database | PostgreSQL, Prisma ORM                                   |
| Email    | Brevo                                                    |

## Project structure

```
client/   React app (pages, components, auth state)
server/   Express API
  prisma/        database schema and migrations
  src/modules/   one folder per feature: routes -> controller -> service
  src/middlewares/   login checks, rate limits, error handling
```

## Run it locally

You need **Node.js 24+** and **PostgreSQL**.

**1. Server**

```bash
cd server
npm install
cp .env.example .env        # then fill in DATABASE_URL and JWT_SECRET
npx prisma migrate dev      # creates the tables
npx prisma generate         # creates the database client
npm run dev                 # http://localhost:5000
```

Leave `BREVO_API_KEY` empty in development: emails (like OTP codes) are printed in the server terminal instead of being sent.

**2. Client** (in a second terminal)

```bash
cd client
npm install
npm run dev                 # open http://localhost:5173
```

## API

Base URL: `/api/v1`. Login sets an httpOnly cookie, so later requests are logged in automatically.

| Method | Path                        | What it does                      |
| ------ | --------------------------- | --------------------------------- |
| POST   | `/auth/register`            | Create a vendor account           |
| POST   | `/auth/login`               | Log in with phone and password    |
| POST   | `/auth/logout`              | Log out                           |
| GET    | `/auth/me`                  | The logged-in vendor, or `null`   |
| POST   | `/auth/verify-email`        | Check the email code              |
| POST   | `/auth/resend-verification` | Send a new email code             |
| POST   | `/auth/forgot-password`     | Send a password reset code        |
| POST   | `/auth/reset-password`      | Set a new password with the code  |
| GET    | `/merchant/profile`         | Vendor profile (verified vendors) |
| PATCH  | `/merchant/profile`         | Update cart details               |
| PATCH  | `/merchant/status`          | Open or close the cart            |
