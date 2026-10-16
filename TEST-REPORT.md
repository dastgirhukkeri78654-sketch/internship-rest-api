# Task 4 — Application Test Report

## Project
Internship REST API and Internship Board

## Test Results

| Test | Expected Result | Actual Result | Status |
|---|---|---|---|
| Empty application form | Browser prevents submission | Submission blocked | PASS |
| Invalid email in browser | Browser reports invalid email | Submission blocked | PASS |
| Valid application | Application accepted | Submitted successfully | PASS |
| Invalid name/email through API | HTTP 400 validation error | HTTP 400 returned | PASS |
| Unknown internship ID | Request rejected | HTTP 404 returned | PASS |
| API request failure | Error message and Retry button appear | Both appeared when request blocking was enabled | PASS |
| Normal API loading | Internship listings appear | Listings returned when blocking was disabled | PASS |
| Security headers | Security headers returned | Helmet-related headers observed in API response | PASS |

## Pending Verification

- Rate-limit enforcement under repeated requests has not yet been tested.
- Loading and error behavior should be rechecked after any future code changes.

## Notes
Results above are based on tests performed locally in the browser and against the development server. They do not represent a production security audit.
