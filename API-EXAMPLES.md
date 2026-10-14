# API Testing Examples

Start the server before running these examples:

```powershell
npm start
```

Base URL: `http://localhost:3000`

## 1. Check API Health

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/health"
```

Expected: `success = true`, `status = ok`.

## 2. List Internships

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/internships?page=1&limit=10"
```

Expected: internship records and pagination information.

## 3. Create an Internship

```powershell
$body = @{
  title = "Backend Intern"
  domain = "Full Stack Development"
  mode = "Remote"
  location = "India"
  durationWeeks = 8
  openings = 2
  applicationsOpen = $true
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri "http://localhost:3000/api/internships" `
  -ContentType "application/json" `
  -Body $body
```

Expected: HTTP 201 Created with the new internship record.

## 4. Update an Internship

```powershell
$body = @{
  title = "Updated Frontend Intern"
  domain = "Full Stack Development"
  mode = "Remote"
  location = "India"
  durationWeeks = 6
  openings = 3
  applicationsOpen = $true
} | ConvertTo-Json

Invoke-RestMethod -Method Put `
  -Uri "http://localhost:3000/api/internships/INT-101" `
  -ContentType "application/json" `
  -Body $body
```

Expected: the updated internship record.

## 5. Submit a Valid Application

This example uses the seeded internship ID `INT-101`.

```powershell
$body = @{
  applicantName = "Test Applicant"
  email = "test@example.com"
  internshipId = "INT-101"
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri "http://localhost:3000/api/applications" `
  -ContentType "application/json" `
  -Body $body
```

Expected: HTTP 201 Created and the message:

`Application submitted successfully.`

The internship must exist, have applications open, and have at least one opening.

## 6. Test Rejected Application Validation

This example deliberately uses an invalid name and email.

```powershell
$body = @{
  applicantName = "A"
  email = "invalid-email"
  internshipId = "INT-101"
} | ConvertTo-Json

try {
  Invoke-RestMethod -Method Post `
    -Uri "http://localhost:3000/api/applications" `
    -ContentType "application/json" `
    -Body $body
} catch {
  Write-Host "Expected validation rejection:"
  Write-Host $_.ErrorDetails.Message
}
```

Expected: HTTP 400 Bad Request with validation errors.

## 7. Test Invalid Internship Data

```powershell
$body = @{
  title = ""
  domain = "Full Stack Development"
  mode = "InvalidMode"
  location = "India"
  durationWeeks = 8
  openings = 2
  applicationsOpen = $true
} | ConvertTo-Json

try {
  Invoke-RestMethod -Method Post `
    -Uri "http://localhost:3000/api/internships" `
    -ContentType "application/json" `
    -Body $body
} catch {
  Write-Host "Expected validation rejection:"
  Write-Host $_.ErrorDetails.Message
}
```

Expected: HTTP 400 Bad Request.

## 8. Delete an Internship (Optional)

**Warning:** This permanently removes the selected internship from the local database. Do not run this unless you intend to delete the record.

```powershell
Invoke-RestMethod -Method Delete `
  -Uri "http://localhost:3000/api/internships/INT-101"
```

Expected: a successful response confirming deletion.

## Security Features

The API includes:

- Helmet security headers.
- API rate limiting.
- JSON request body size limit.
- Server-side input validation.
- Parameterized SQL queries.
- JSON error responses for invalid requests and unknown routes.

These examples are intended for local development and testing.