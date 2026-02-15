# Incident Tracker Frontend

This is the frontend application for the Incident Tracker, built with React and Vite.

## Features
- **Incident List**: View incidents with server-side pagination, sorting, and filtering.
- **Search**: Debounced search for incident titles.
- **Create**: Create new incidents with validation.
- **Detail**: View and edit incident details.
- **Design**: Clean, responsive UI with state-based badges.

## Prerequisites
- Node.js (v18+)
- Backend server running on `http://localhost:8080` (or configure proxy in `vite.config.js`)

## Installation
1. Install dependencies:
   ```bash
   npm install
   ```

## Running Locally
Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## API Integration
The frontend is configured to proxy API requests to `http://localhost:8080`.
Ensure your backend exposes the following endpoints:
- `GET /api/incidents` (supports page, size, sort, title, service, severity, status)
- `POST /api/incidents`
- `GET /api/incidents/:id`
- `PATCH /api/incidents/:id`
