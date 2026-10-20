# Task 4 — Application Test Report

## Project
Internship REST API and Internship Board

## Test Results

| Test | Expected Result | Actual Result | Status |
|---|---|---|---|
| Empty application form | Browser prevents submission | Submission blocked | PASS |
| Invalid email in browser | Browser reports invalid email | Submission blocked | PASS |
| Valid application | Application accepted | HTTP 201 returned | PASS |
| Invalid application data through API | HTTP 400 validation error | HTTP 400 returned | PASS |
| Unknown internship ID | Request rejected | HTTP 404 returned | PASS |
| Duplicate application | Duplicate submission rejected | HTTP 409 returned | PASS |
| Rate-limit enforcement | Excess requests are limited | HTTP 429 returned during repeated requests | PASS |
| API request failure | Error message and Retry button appear | Both appeared when request blocking was enabled | PASS |
| Normal API loading | Internship listings appear | Listings returned when blocking was disabled | PASS |
| API health check | HTTP 200 and database connected | Both confirmed at `/api/health` | PASS |
| Security headers | Security headers returned | Helmet-related headers observed in API response | PASS |

## Pending Verification

- Recheck loading and error behavior after future code changes.
- Production deployment and production-environment testing, if required by the submission.

## Notes

Results are based on tests performed locally in the browser and against the development server. They do not represent a production security audit.
