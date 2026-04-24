# Store Rating Platform

A full-stack web application allowing users to submit ratings for stores. Built with modern, clean architecture.

## Tech Stack
- **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL, Zod, JWT, bcrypt
- **Frontend**: React, Vite, TypeScript, Vanilla CSS (Glassmorphism), Axios, Phosphor Icons

## Features
- **3 Roles**: System Administrator, Normal User, Store Owner.
- **Admin**: Manage users and stores, view statistics, global dashboard.
- **Normal User**: Discover stores, search by name/address, rate stores (1-5 stars).
- **Store Owner**: View their stores' performance and who rated them.
- **Validations**: Strict backend Zod validations & frontend HTML5 validations (e.g. 20-60 char Name limits).
- **Clean Architecture**: Backend separated into Routes, Controllers, Services, Middlewares, Schemas.

## Prerequisites
- Node.js (v18+)
- PostgreSQL (running locally or accessible via URL)

## Setup Instructions

### 1. Database Setup
1. Create a PostgreSQL database named `online_rating_app` (or use any existing one).
2. Open `backend/.env` and update the `DATABASE_URL` with your PostgreSQL credentials.

### 2. Backend Setup
```bash
cd backend
npm install
npx prisma db push    # This creates the tables in your PostgreSQL database
npm run dev           # Starts the development server on http://localhost:5000
```
*Note: The first user to register will automatically be assigned the `ADMIN` role. Subsequent users will be `USER` by default unless created by an Admin.*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev           # Starts the Vite dev server (usually http://localhost:5173)
```

## API Endpoints List

### Auth (`/api/v1/auth`)
- `POST /register` - Register a new user (Body: name, email, password, address)
- `POST /login` - Login user (Body: email, password)
- `PUT /password` - Update password (Header: Bearer Token, Body: oldPassword, newPassword)

### Users (`/api/v1/users`) - *Requires Admin Token*
- `GET /` - List users with filtering (Query: name, email, address, role, sortField, sortOrder, page, limit)
- `POST /` - Admin creates user (Body: name, email, password, address, role)
- `GET /:id` - Get specific user details

### Stores (`/api/v1/stores`)
- `GET /` - List stores (Query: name, address, sortField). Returns calculated average ratings and current user's rating.
- `POST /` - Admin creates store (Body: name, email, address, ownerId)
- `GET /owner-dashboard` - Store Owner dashboard data.

### Ratings (`/api/v1/ratings`) - *Requires Normal User Token*
- `POST /` - Submit a rating (Body: storeId, rating)
- `PUT /:storeId` - Update a rating (Body: rating)

## Default Users for Testing
To quickly test the platform:
1. Register a user via the UI. Ensure the name is **at least 20 characters** (e.g., `Testing Admin Name Here`). This first user becomes the `ADMIN`.
2. Login with that user, navigate to the Dashboard, and create an `OWNER` user and a `USER`.
3. Create a store assigning the `OWNER`'s ID.
4. Login as the normal `USER`, search for the store, and rate it.
5. Login as the `OWNER` to see the rating in the dashboard.
