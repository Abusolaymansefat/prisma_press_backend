# Prisma Press Backend

A TypeScript Express backend using Prisma and PostgreSQL. This project implements user registration, login, profile retrieval, and profile updates with JWT authentication and role-based access control.

## Features

- PostgreSQL database with Prisma ORM
- User registration and login
- JWT access and refresh tokens
- Cookie-based auth support
- Role-based middleware using `USER`, `AUTHOR`, and `ADMIN`
- Profile model with `profilePhoto` and `bio`

## Prerequisites

- Node.js 20+ and npm
- PostgreSQL database
- A `.env` file in the project root

## Setup

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file in the project root and add the required environment variables.

3. Generate Prisma client artifacts

```bash
npx prisma generate
```

4. Apply Prisma migrations to your database

```bash
npx prisma migrate deploy
```

If you are developing locally and do not need to preserve production migrations, you can also use:

```bash
npx prisma db push
```

5. Start the development server

```bash
npm run dev
```

## Environment Variables

Create a `.env` file with the following variables:

```env
PORT=4000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
APP_URL=http://localhost:5173
BCRYPT_SALT_ROUNDS=10
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d
```

## Available Scripts

- `npm run dev` - Start the server in development mode using `tsx watch`
- `npm run build` - Compile TypeScript sources to `dist`
- `npm start` - Start the compiled production server

## API Endpoints

### Health Check

- `GET /`

Returns a simple working-status message.

### Register User

- `POST /api/users/register`

Request body example:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "strong_password",
  "profilePhoto": "https://example.com/avatar.png"
}
```

Response includes user data without the password.

### Login User

- `POST /api/auth/login`

Request body example:

```json
{
  "email": "john@example.com",
  "password": "strong_password"
}
```

Response sets `accessToken` and `refreshToken` cookies and returns both tokens in the response body.

### Get My Profile

- `GET /api/users/me`

Requires authentication via cookie or `Authorization: Bearer <accessToken>` header.

### Update My Profile

- `PUT /api/users/my-profile`

Requires authentication. Request body example:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "profilePhoto": "https://example.com/avatar.png",
  "bio": "Software engineer"
}
```

## Prisma Models

The database schema includes the following models:

- `User` - stores account data, password hash, role, and status
- `Profile` - stores a user's profile photo and bio

## Notes

- CORS is configured using `APP_URL`.
- The auth middleware supports required role validation and blocks users with `BLOCKED` status.
- Passwords are hashed using `bcryptjs`.

## Troubleshooting

- If `npx prisma generate` fails, verify `DATABASE_URL` and Prisma schema configuration.
- If the server cannot connect to the database, confirm PostgreSQL is running and the connection string is valid.
