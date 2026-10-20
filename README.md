## Live Demo

- **Live Application:** https://internship-rest-api-u86y.onrender.com/
- **API Health Check:** https://internship-rest-api-u86y.onrender.com/api/health
- **GitHub Repository:** https://github.com/dastgirhukkeri78654-sketch/internship-rest-api

## Live Deployment Verification

The deployed application was tested successfully for the following:

- Internship search and domain filtering
- Valid application submission
- Duplicate application prevention
- Required-field validation
- API health check

The health endpoint returned a successful response with the database status reported as connected.

## Technology Stack

- Node.js
- Express.js
- SQLite using `sql.js`
- Helmet for security headers
- Express Rate Limit for API rate limiting

## Deployment Note

The application is deployed on Render's free web service. The SQLite database file is stored on the service's local filesystem, so data may not persist across restarts or redeployments.
# Internship REST API & Internship Board

A responsive internship board built with **Node.js, Express, sql.js (SQLite), HTML, CSS, and JavaScript**. Users can explore internships, search and filter listings, view internship details, and submit applications.

## Features
- Duplicate application prevention for the same email address and internship.
- Responsive interface designed for mobile and desktop.
- Internship listings loaded from the REST API.
- Search, domain filtering, and work-mode filtering.
- Internship details and application form.
- Loading, empty, error, and retry states.
- Client-side and server-side input validation.
- SQLite-backed internship and application storage.
- Consistent JSON API responses and error handling.
- Request logging with timestamps, HTTP methods, paths, status codes, and response durations.
- Health-check endpoint.
- Security headers using Helmet.
- API rate limiting and a 10 KB JSON request-body limit.
- Parameterized SQL queries.

## Technology Stack

| Technology | Purpose |
|---|---|
| HTML | Page structure |
| CSS | Responsive design |
| JavaScript | Frontend interactions |
| Node.js | JavaScript runtime |
| Express.js | REST API and web server |
| sql.js (SQLite) | Local database |
| Helmet | Security-related HTTP headers |
| express-rate-limit | API rate limiting |

## Requirements

Install Node.js LTS from https://nodejs.org/.

Verify installation:

```bash
node --version
npm --version
```

## Run the Project Locally

1. Open this project folder in VS Code.
2. Open **Terminal → New Terminal**.
3. Install dependencies:

```bash
npm install
```

4. Start the server:

```bash
npm start
```

5. Open the application:

http://localhost:3000/

6. Open the API guide:

http://localhost:3000/api

7. Check server health:

http://localhost:3000/api/health

The application initializes its local database and adds five fictional internship records when the internship table is empty. Database changes are saved in `internships.sqlite`.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api` | API guide |
| GET | `/api/health` | Health check |
| GET | `/api/internships?page=1&limit=10` | List internships with pagination |
| GET | `/api/internships/:id` | Retrieve an internship |
| POST | `/api/internships` | Create an internship |
| PUT | `/api/internships/:id` | Update an internship |
| DELETE | `/api/internships/:id` | Delete an internship |
| POST | `/api/applications` | Submit an application |
Submitting another application for the same internship with the same email address returns HTTP `409 Conflict`.

## Example API Requests

### Create an internship

Send a JSON request to `POST /api/internships`:

```json
{
  "title": "Backend Intern",
  "domain": "Full Stack Development",
  "mode": "Remote",
  "location": "India",
  "durationWeeks": 8,
  "openings": 2,
  "applicationsOpen": true
}
```

Allowed work modes are `Remote`, `Hybrid`, and `On-site`. Internship duration must be between 1 and 104 weeks.

### Submit an application

Send a JSON request to `POST /api/applications`:

```json
{
  "applicantName": "Test Applicant",
  "email": "test@example.com",
  "internshipId": "INT-101"
}
```

A successful application returns HTTP `201`. Invalid input returns a validation error. Use fictional applicant information for testing.

## Frontend Behaviour

The frontend is served from the `public/` directory.

- Loads internship data from the API.
- Supports keyword search and domain/work-mode filters.
- Displays internship details.
- Populates application options using API data.
- Displays loading, empty, and error states.
- Provides a retry action when a request fails.
- Validates application input and displays the API response.

## Logging and Health Checks

The server logs request metadata, including:

- Timestamp
- HTTP method
- Request path
- HTTP response status
- Response duration in milliseconds

Request bodies and applicant personal information should not be included in request logs.

Check the health endpoint at:

`GET /api/health`

A healthy response currently returns:

```json
{
  "success": true,
  "status": "ok",
  "database": "connected"
}
```

## Security Measures

- **Helmet:** Adds security-related HTTP headers.
- **Rate limiting:** Limits API traffic to 100 requests per 15-minute window.
- **Request size limit:** Restricts JSON request bodies to 10 KB.
- **Server-side validation:** Validates internship and application inputs.
- **Parameterized SQL:** Helps protect against SQL injection.
- **Error handling:** Returns structured API errors.
- **Git exclusions:** `.env`, local database files, and `node_modules/` are excluded from version control.

These controls reduce common risks but do not replace a full security audit. Production deployment requires additional review of authentication, authorization, personal-data protection, and operational security.

## Testing and Verification

### Checks completed
- [x] Duplicate application submission is rejected with HTTP `409 Conflict`.
- [x] Empty application submission returns HTTP `400 Bad Request` with validation details.
- [x] Health endpoint at `/api/health` returns HTTP `200 OK` with database status `connected`.

- [x] Application starts using `npm start`.
- [x] Health endpoint returns HTTP 200.
- [x] Health response reports the database as connected.
- [x] Security headers and rate-limit headers are returned.
- [x] JavaScript syntax check passed using `node --check server.js`.
- [x] Internship listings load.
- [x] Search works.
- [x] Domain and work-mode filters work.
- [x] Internship details display correctly.
- [x] Empty form and invalid email are rejected.
- [x] API failure message and retry button work.
- [x] Mobile layout tested at 360 px with no horizontal scrolling.
- [x] Request-logging middleware is present.

**Additional verification:** Confirm request logs appear in the server terminal after a request. Complete any remaining keyboard-accessibility, regression, and security checks before describing the project as production-ready.

## Project Structure

```text
internship-rest-api/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── server.js
├── package.json
├── package-lock.json
├── README.md
├── API-EXAMPLES.md
├── TEST-REPORT.md
├── SECURITY-CHECKLIST.md
└── .gitignore
```

## Scope and Limitations

This project uses fictional internship records and runs locally by default. It is not connected to EdVyro's internal systems or real applicant records.

The project should undergo additional testing and deployment checks before being used with real applicants or sensitive information.

## Deployment and Walkthrough

- **Live application URL:** Add the deployed URL after deployment.
- **Walkthrough video:** Add the video link after recording.
- **Test evidence:** Add screenshots or links to the completed test report.

Do not publish credentials, API secrets, or real applicant data in screenshots or documentation.

## Author

**Dastagir Hukkeri**

Full Stack Development Internship — Capstone Project
