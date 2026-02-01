# Club Management Backend

This is the backend for the Club Management System.

## Features
- **Audit Logs**: Mock data serving for system audit trails.
- **Authentication**: Mock login/register (in-memory user store).
- **Club Management**: CRUD operations for clubs (in-memory store).

## Tech Stack
- Node.js
- Express
- CORS
- Dotenv

## Setup
1. `npm install`
2. `npm start` (Runs on port 5000)

## API Endpoints
### Audit
- `GET /api/audit/logs` - Get all audit logs (supports optional `actionType` query param)

### Auth
- `POST /api/auth/login` - Login (test with `admin@example.com` / `password`)
- `POST /api/auth/register` - Register a new user

### Clubs
- `GET /api/clubs` - Get all clubs
- `GET /api/clubs/:id` - Get club by ID
- `POST /api/clubs` - Create a club
- `PUT /api/clubs/:id` - Update a club
- `DELETE /api/clubs/:id` - Delete a club
