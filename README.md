# Book API - Auth & Authorization

NestJS + Prisma + PostgreSQL

## Setup
npm install
npx prisma migrate dev --name init
npm run start:dev

## Endpoints
- POST /auth/register
- POST /auth/login (throttled: 5/min)
- GET /users/profile (protected)
- GET /books?search=&genreId=&page=1&limit=10
- POST /books (LIBRARIAN only)
- PATCH /books/:id (LIBRARIAN only)
- DELETE /books/:id (LIBRARIAN only)
- CRUD /genres