# Task 4 — Security Checklist

## Implemented in the application

- [x] Helmet security headers configured.
- [x] API rate limiter configured for 100 requests per 15 minutes.
- [x] JSON request body size limited to 10 KB.
- [x] Server-side validation for applicant name and email.
- [x] Internship ID checked before accepting an application.
- [x] Unknown application fields rejected.
- [x] Parameterized SQL used for application insertion (verify other database queries before claiming full coverage).

## Verified by testing
- [x] Unknown API routes return HTTP 404.
- [x] Malformed JSON requests return HTTP 400.
- [x] Duplicate applications return HTTP 409.
- [x] Rate-limit enforcement verified with repeated requests; HTTP 429 returned when the limit was reached.
- [x] Invalid application data rejected with HTTP 400.
- [x] Unknown internship ID rejected with HTTP 404.
- [x] Security headers observed in API responses.
- [x] Error state displayed when internship API requests fail.


## Scope
This checklist records the current development implementation and observed tests. It is not a certification or a guarantee that the application is free from security vulnerabilities.
