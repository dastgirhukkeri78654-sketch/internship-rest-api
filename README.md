# Internship REST API & Internship Board

A beginner-friendly full-stack internship board built with Node.js, Express, a SQLite database powered by sql.js, and a responsive HTML/CSS/JavaScript frontend.

The application retrieves internship records through an API and provides search, domain filtering, and an internship application form.

## Features

- Responsive internship listing interface.
- API-driven internship cards.
- Search internships and filter by domain.
- Loading, error, retry, and empty-result states.
- Application form with client-side and server-side validation.
- SQLite-backed storage for internship records and submitted applications.
- JSON API responses with consistent error handling.
- Security middleware and parameterized SQL queries.

## Requirements

Install Node.js LTS from https://nodejs.org/. npm is included.

## Run locally

1. Open this project folder in VS Code.
2. Open Terminal → New Terminal.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the server:

   ```bash
   npm start
   ```

5. Open the internship board:

   http://localhost:3000/

6. Open the API guide:

   http://localhost:3000/api

The first run initializes the local SQLite database and seeds five fictional internship records. Database changes are saved locally in `internships.sqlite`.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api` | API guide |
| GET | `/api/health` | Health check |
| GET | `/api/internships?page=1&limit=10` | List internships with pagination |
| GET | `/api/internships/:id` | Retrieve one internship |
| POST | `/api/internships` | Create an internship |
| PUT | `/api/internships/:id` | Update an internship |
| DELETE | `/api/internships/:id` | Delete an internship |
| POST | `/api/applications` | Submit an internship application |

### Internship record example

Example request body for `POST /api/internships`:

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

Allowed `mode` values are `Remote`, `Hybrid`, and `On-site`. The duration must be between 1 and 104 weeks, and openings must be between 0 and 10000.

### Application submission example

Send a JSON request to `POST /api/applications`:

```json
{
  "applicantName": "Test Applicant",
  "email": "test@example.com",
  "internshipId": "INT-101"
}
```

A successful submission returns HTTP `201` and a success message. Invalid input returns a validation error. Applications are saved to the local database.

Use fictional test names and email addresses when testing.

## Frontend behavior

The frontend is served by Express from the `public/` directory.

- Fetches internship records from `/api/internships`.
- Populates the domain filter and application dropdown using API data.
- Displays loading and error states.
- Supports search and domain filtering.
- Submits application data to `/api/applications`.
- Displays the API response to the user.

## Security measures

The application includes the following measures in its server implementation:

- **Helmet:** sets security-related HTTP headers.
- **Rate limiting:** limits API requests to reduce excessive request traffic.
- **Request size limit:** limits JSON request bodies.
- **Server-side validation:** checks application fields before saving.
- **Parameterized SQL queries:** separates user-supplied values from SQL statements.
- **Error handling:** returns structured API errors.
- **Environment secrets:** `.env` is excluded from Git.

These measures reduce common application risks but do not constitute a complete security audit.

## Quick tests

With the server running, check:

- Health: http://localhost:3000/api/health
- First page: http://localhost:3000/api/internships?page=1&limit=2
- Internship details: http://localhost:3000/api/internships/INT-101
- API guide: http://localhost:3000/api

Test application submission with the PowerShell examples in `API-EXAMPLES.md` or an API client such as Postman.

Verify both valid and invalid application submissions, and confirm that the frontend displays the appropriate result.

## Project structure

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
└── .gitignore
```

The local database file and `node_modules/` directory are excluded from version control.

## Scope and limitations

This project uses fictional internship records and runs locally by default. It is not connected to EdVyro's internal systems or real internship applicant records.

Before production deployment, additional checks may be required for authentication, authorization, personal-data protection, database constraints, logging, and deployment configuration.
