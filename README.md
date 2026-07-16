# Salon Booking System

A full-stack web application for managing salon services and customer bookings. This system allows administrators to manage services, while customers can easily book appointments online.

## Features

- **Service Management**: Create, read, update, and delete salon services with pricing and duration
- **Booking System**: Customers can view available services and book appointments with stylists
- **Admin Protection**: Delete operations require admin password authentication
- **Input Validation**: Comprehensive server-side validation using express-validator

## Tech Stack

- **Backend**: Node.js, Express.js (v5.2.1)
- **Frontend**: EJS templating, CSS
- **Database**: PostgreSQL
- **Validation**: express-validator
- **Environment**: dotenv for configuration management

## Installation

1. Clone the repository:
```bash
git clone https://github.com/NomadicHippiee/salon-booking-system.git
cd salon-booking-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```bash
cp .env.example .env
```
Configure your `.env` file with:
- `PORT` - Server port (default: 3000)
- `DATABASE_URL` - PostgreSQL connection string
- `ADMIN_PASSWORD` - Password for admin operations

4. Initialize the database:
```bash
psql -U your_user -d your_database -f db/init.sql
```

## Running the Application

**Development mode** (with hot-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
├── controllers/           # Business logic for services and bookings
├── db/                   # Database initialization and schema
├── public/               # Static files (CSS, images)
├── routes/               # API route definitions
├── views/                # EJS templates for UI
├── server.js             # Express app setup
└── package.json          # Dependencies and scripts
```

## API Routes

**Services**:
- `GET /services` - View all services
- `GET /services/new` - Service creation form
- `POST /services` - Create new service
- `GET /services/:id` - View service details
- `GET /services/:id/edit` - Edit service form
- `POST /services/:id` - Update service
- `GET /services/:id/delete` - Delete confirmation
- `POST /services/:id/delete` - Delete service

**Bookings**:
- `GET /bookings` - View all bookings
- `GET /bookings/new` - Booking form
- `POST /bookings` - Create new booking
- `POST /bookings/:id/delete` - Delete booking

## License

ISC
