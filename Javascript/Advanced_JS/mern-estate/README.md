# MERN Estate

A modern Real Estate marketplace built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- Real-time Property Listings
- User Authentication (including Google OAuth)
- Advanced Search and Filtering
- Dashboard for managing listings
- Dark Mode support
- Responsive Design

## Prerequisites

- Node.js (v18+)
- MongoDB
- Firebase (for Authentication and Storage)

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mern-estate
   ```

2. Install dependencies for both backend and frontend:
   ```bash
   npm run build
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   MONGO=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Create a `.env` file in the `client` directory:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   ```

## Running the App

### Local Development

- Start the backend:
  ```bash
  npm run dev
  ```
- Start the frontend (in a separate terminal):
  ```bash
  cd client
  npm run dev
  ```

### Using Docker

You can run the entire application using Docker.

#### Option 1: Docker Compose (Recommended)

1. Make sure you have your `.env` files set up.
2. Run the following command:
   ```bash
   docker-compose up --build
   ```
3. The app will be available at `http://localhost:3000`.

#### Option 2: Docker Build & Run

1. Build the image:
   ```bash
   docker build --build-arg VITE_FIREBASE_API_KEY=your_firebase_api_key -t mern-estate .
   ```
2. Run the container:
   ```bash
   docker run -p 3000:3000 --env-file .env mern-estate
   ```

## Deployment

The project is configured for easy deployment on platforms like Render or Railway.
The backend serves the frontend from the `client/dist` directory after the build process.
