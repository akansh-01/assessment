# Incident Tracker

A full-stack application for managing production incidents. The backend API provides RESTful endpoints for creating, browsing, filtering, sorting, and managing incidents with server-side pagination.

## Repository structure

```
├── backend/          # Spring Boot API (this README describes backend setup & API)
│   ├── build.gradle
│   ├── src/
│   └── ...
├── frontend/         # Frontend app (placeholder; add your UI here)
└── README.md         # This file
```

## Tech Stack (Backend)

- **Java 21**
- **Spring Boot 3.5.11-SNAPSHOT**
- **Spring Data JPA** with Specifications API
- **PostgreSQL** (Database)
- **Lombok** (Reduces boilerplate code)
- **Gradle** (Build tool)

## Why PostgreSQL?

PostgreSQL was chosen for this project because:

1. **JPA Specifications Support**: PostgreSQL works seamlessly with Spring Data JPA Specifications, allowing dynamic query building for complex filtering and searching
2. **Performance**: Excellent performance for read-heavy workloads with proper indexing
3. **Advanced Features**: Supports complex queries, full-text search capabilities, and robust indexing strategies
4. **Production Ready**: Widely used in production environments with proven reliability
5. **Indexing Support**: Efficient indexing on filtered columns (service, severity, status, created_at) for optimal query performance

## Prerequisites

- Java 21 or higher
- PostgreSQL 12 or higher
- Gradle 7.x or higher (or use the included Gradle wrapper)

## Database Setup

1. Install PostgreSQL if not already installed
2. Create a database:
   ```sql
   CREATE DATABASE incident_db;
   ```
3. Update `backend/src/main/resources/application.yaml` with your PostgreSQL credentials:
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/incident_db
       username: your_username
       password: your_password
   ```

## Running the Application

1. **Clone the repository** (if applicable).

2. **Go to the backend directory**:
   ```bash
   cd backend
   ```

3. **Build the project**:
   ```bash
   ./gradlew build
   ```
   Or on Windows:
   ```bash
   gradlew.bat build
   ```

4. **Run the application**:
   ```bash
   ./gradlew bootRun
   ```
   Or on Windows:
   ```bash
   gradlew.bat bootRun
   ```

5. The application will start on `http://localhost:8080`

6. **Database Seeding**: On first run, the application will automatically seed the database with ~200 sample incidents. The seeder runs only if the database is empty.

## API Overview

### Base URL
```
http://localhost:8080/api/incidents
```

### Endpoints

#### 1. Create Incident
**POST** `/api/incidents`

Creates a new incident with validation.

**Request Body:**
```json
{
  "title": "API Timeout",
  "service": "Backend",
  "severity": "SEV1",
  "status": "OPEN",
  "owner": "dev@team",
  "summary": "API requests timing out"
}
```

**Response:** `201 Created`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "API Timeout",
  "service": "Backend",
  "severity": "SEV1",
  "status": "OPEN",
  "owner": "dev@team",
  "summary": "API requests timing out",
  "createdAt": "2024-04-15T10:30:00",
  "updatedAt": "2024-04-15T10:30:00"
}
```

**Validation:**
- `title`: Required, cannot be blank
- `service`: Required, cannot be blank
- `severity`: Required, must be one of: SEV1, SEV2, SEV3, SEV4
- `status`: Required, must be one of: OPEN, MITIGATED, RESOLVED
- `owner`: Optional
- `summary`: Optional

---

#### 2. Get Incidents (Paginated with Filters)
**GET** `/api/incidents`

Retrieves a paginated list of incidents with server-side filtering, sorting, and search.

**Query Parameters:**
- `search` (optional): Search term to match against title, service, owner, or summary
- `service` (optional): Filter by service name (exact match, case-insensitive)
- `severity` (optional): Filter by severity. Multiple values comma-separated (e.g., `SEV1,SEV2`)
- `status` (optional): Filter by status. Multiple values comma-separated (e.g., `OPEN,MITIGATED`)
- `sortBy` (optional, default: `createdAt`): Field to sort by. Options: `title`, `severity`, `status`, `createdAt`, `owner`, `service`
- `sortDir` (optional, default: `desc`): Sort direction. Options: `asc`, `desc`
- `page` (optional, default: `0`): Page number (0-indexed)
- `size` (optional, default: `10`): Number of items per page

**Example Requests:**
```
GET /api/incidents?page=0&size=10&sortBy=createdAt&sortDir=desc
GET /api/incidents?search=timeout&service=Backend&severity=SEV1&status=OPEN
GET /api/incidents?severity=SEV1,SEV2&status=OPEN,MITIGATED&page=0&size=20
```

**Response:** `200 OK`
```json
{
  "content": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "API Timeout",
      "service": "Backend",
      "severity": "SEV1",
      "status": "OPEN",
      "owner": "dev@team",
      "summary": "API requests timing out",
      "createdAt": "2024-04-15T10:30:00",
      "updatedAt": "2024-04-15T10:30:00"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 150,
  "totalPages": 15,
  "first": true,
  "last": false
}
```

---

#### 3. Get Incident by ID
**GET** `/api/incidents/{id}`

Retrieves a single incident by its UUID.

**Path Parameters:**
- `id`: UUID of the incident

**Example:**
```
GET /api/incidents/550e8400-e29b-41d4-a716-446655440000
```

**Response:** `200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "API Timeout",
  "service": "Backend",
  "severity": "SEV1",
  "status": "OPEN",
  "owner": "dev@team",
  "summary": "API requests timing out",
  "createdAt": "2024-04-15T10:30:00",
  "updatedAt": "2024-04-15T10:30:00"
}
```

**Error Response:** `404 Not Found`
```json
{
  "message": "Incident not found with id: 550e8400-e29b-41d4-a716-446655440000",
  "status": 404
}
```

---

#### 4. Update Incident
**PATCH** `/api/incidents/{id}`

Partially updates an incident. Only provided fields will be updated.

**Path Parameters:**
- `id`: UUID of the incident

**Request Body:** (All fields optional)
```json
{
  "title": "Updated Title",
  "service": "Updated Service",
  "severity": "SEV2",
  "status": "MITIGATED",
  "owner": "newowner@team",
  "summary": "Updated summary"
}
```

**Example:**
```
PATCH /api/incidents/550e8400-e29b-41d4-a716-446655440000
```

**Response:** `200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Updated Title",
  "service": "Updated Service",
  "severity": "SEV2",
  "status": "MITIGATED",
  "owner": "newowner@team",
  "summary": "Updated summary",
  "createdAt": "2024-04-15T10:30:00",
  "updatedAt": "2024-04-15T11:45:00"
}
```

**Error Response:** `404 Not Found`
```json
{
  "message": "Incident not found with id: 550e8400-e29b-41d4-a716-446655440000",
  "status": 404
}
```

---

## Error Handling

The API uses a global exception handler that returns consistent error responses:

**Validation Errors (400 Bad Request):**
```json
{
  "message": "Validation failed",
  "errors": {
    "title": "Title is required",
    "severity": "Severity is required"
  },
  "status": 400
}
```

**Not Found (404):**
```json
{
  "message": "Incident not found with id: ...",
  "status": 404
}
```

**Internal Server Error (500):**
```json
{
  "message": "An unexpected error occurred",
  "status": 500
}
```

## Database Schema

### Incidents Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| title | VARCHAR | NOT NULL | Incident title |
| service | VARCHAR | NOT NULL | Service name (indexed) |
| severity | VARCHAR | NOT NULL | SEV1, SEV2, SEV3, SEV4 (indexed) |
| status | VARCHAR | NOT NULL | OPEN, MITIGATED, RESOLVED (indexed) |
| owner | VARCHAR | NULL | Owner email |
| summary | TEXT | NULL | Incident summary |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp (indexed) |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |

**Indexes:**
- `idx_service` on `service`
- `idx_severity` on `severity`
- `idx_status` on `status`
- `idx_created_at` on `created_at`

## Design Decisions & Tradeoffs

### 1. **JPA Specifications for Dynamic Queries**
   - **Decision**: Used Spring Data JPA Specifications instead of native queries or QueryDSL
   - **Rationale**: 
     - Type-safe query building
     - Easy to combine multiple filters
     - Maintainable and testable
     - No need for additional dependencies
   - **Tradeoff**: Slightly more verbose than QueryDSL, but sufficient for this use case

### 2. **PostgreSQL as Database**
   - **Decision**: PostgreSQL over MySQL or H2
   - **Rationale**:
     - Excellent JPA support
     - Advanced indexing capabilities
     - Production-ready
     - Good performance for complex queries
   - **Tradeoff**: Requires external database setup vs. in-memory H2, but more realistic for production

### 3. **UUID vs. Auto-increment ID**
   - **Decision**: UUID for primary keys
   - **Rationale**:
     - Globally unique identifiers
     - Better for distributed systems
     - No sequence conflicts
   - **Tradeoff**: Slightly larger storage and index size, but better for scalability

### 4. **Server-side Pagination**
   - **Decision**: Implemented server-side pagination with Spring Data's Pageable
   - **Rationale**:
     - Required by assignment
     - Better performance for large datasets
     - Reduces network payload
   - **Tradeoff**: Requires database round-trip for each page, but necessary for scalability

### 5. **PATCH vs. PUT for Updates**
   - **Decision**: PATCH endpoint for partial updates
   - **Rationale**:
     - Follows REST best practices
     - Allows updating only specific fields
     - More flexible for frontend
   - **Tradeoff**: Requires validation logic to handle partial updates

### 6. **Database Indexing Strategy**
   - **Decision**: Indexed frequently filtered columns (service, severity, status, created_at)
   - **Rationale**:
     - Improves query performance
     - Essential for server-side filtering
   - **Tradeoff**: Slightly slower writes, but significantly faster reads

### 7. **Automatic Database Seeding**
   - **Decision**: CommandLineRunner for seeding on startup
   - **Rationale**:
     - Easy to test and demonstrate
     - Runs only if database is empty
   - **Tradeoff**: Could be moved to a separate script for production

### 8. **Global Exception Handler**
   - **Decision**: Centralized exception handling with @RestControllerAdvice
   - **Rationale**:
     - Consistent error responses
     - Cleaner controller code
     - Easy to maintain
   - **Tradeoff**: All exceptions go through same handler, but provides consistency

## Testing the API

### Using cURL

**Create Incident:**
```bash
curl -X POST http://localhost:8080/api/incidents \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Incident",
    "service": "Backend",
    "severity": "SEV1",
    "status": "OPEN",
    "owner": "test@team",
    "summary": "Test summary"
  }'
```

**Get Incidents:**
```bash
curl "http://localhost:8080/api/incidents?page=0&size=10&sortBy=createdAt&sortDir=desc"
```

**Get Incident by ID:**
```bash
curl http://localhost:8080/api/incidents/{id}
```

**Update Incident:**
```bash
curl -X PATCH http://localhost:8080/api/incidents/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "status": "RESOLVED",
    "summary": "Issue resolved"
  }'
```

### Using Postman

Import the following collection or create requests manually:

1. **POST** `http://localhost:8080/api/incidents`
2. **GET** `http://localhost:8080/api/incidents?page=0&size=10`
3. **GET** `http://localhost:8080/api/incidents/{id}`
4. **PATCH** `http://localhost:8080/api/incidents/{id}`

## Project Structure (Backend)

```
backend/src/main/java/com/project/incident/
├── IncidentApplication.java          # Main application class
├── config/
│   └── DataSeeder.java               # Database seeding logic
├── controller/
│   └── IncidentController.java       # REST API endpoints
├── dto/
│   ├── IncidentRequest.java          # Request DTO
│   ├── IncidentResponse.java         # Response DTO
│   ├── UpdateIncidentRequest.java    # Update request DTO
│   └── PageResponse.java             # Pagination response wrapper
├── exception/
│   └── GlobalExceptionHandler.java   # Global exception handling
├── model/
│   └── Incident.java                 # JPA entity
├── repository/
│   └── IncidentRepository.java       # JPA repository
├── service/
│   └── IncidentService.java          # Interface with business function
|   service/impl
│            └── IncidentServiceImpl.java  # Business logic 
└── specification/
    └── IncidentSpecification.java    # JPA Specifications for dynamic queries
```

## Pushing to GitHub

1. **Stage and commit your changes** (from the repo root, i.e. the folder that contains `backend/` and `frontend/`):
   ```bash
   git add .
   git status
   git commit -m "Initial commit: Incident Tracker backend API with repo structure"
   ```

2. **Create a new repository on GitHub** (do not add a README or .gitignore there).

3. **Add the remote and push** (replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repo name):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

   If the repo already had a remote (e.g. from cloning), use:
   ```bash
   git push -u origin main
   ```

4. Share the repository link with the hiring team.