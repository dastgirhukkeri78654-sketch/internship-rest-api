# Internship REST API

A beginner-friendly REST API for fictional internship records, built with Node.js, Express, and SQLite (`sql.js`). Includes local database persistence, validation, pagination, CRUD endpoints, and consistent JSON errors.

## Requirements
Install Node.js LTS from https://nodejs.org/ (npm is included).

## Run locally
1. Open this folder in VS Code.
2. Open Terminal → New Terminal.
3. Run `npm install`.
4. Run `npm start`.
5. Open `http://localhost:3000/api` in your browser.

The first run creates `internships.sqlite` and seeds five fictional internship records. Changes are saved to that local database file.

## Endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/internships?page=1&limit=10` | List records with pagination |
| GET | `/api/internships/:id` | Get one record |
| POST | `/api/internships` | Create a record |
| PUT | `/api/internships/:id` | Update a record |
| DELETE | `/api/internships/:id` | Delete a record |

Allowed `mode` values: `Remote`, `Hybrid`, `On-site`. `durationWeeks` must be 1–104 and `openings` must be 0–10000.

## Example POST JSON
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

## Quick tests
- Health: `http://localhost:3000/api/health`
- First page: `http://localhost:3000/api/internships?page=1&limit=2`
- Detail: `http://localhost:3000/api/internships/INT-101`
- API guide: `http://localhost:3000/api`

For POST/PUT/DELETE tests, use Postman or the PowerShell examples in `API-EXAMPLES.md`.

## Response format
Success responses contain `success: true`. Errors contain `success: false` and `error.message`. List responses also include pagination metadata.

## Scope
Uses fictional data and runs locally; it does not connect to EdVyro systems or real user records.
