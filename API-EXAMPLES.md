# API testing examples
Start the server with `npm start` first.

## PowerShell: create a record
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
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/internships" -ContentType "application/json" -Body $body
```

## PowerShell: update a record
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
Invoke-RestMethod -Method Put -Uri "http://localhost:3000/api/internships/INT-101" -ContentType "application/json" -Body $body
```

## PowerShell: delete a record
```powershell
Invoke-RestMethod -Method Delete -Uri "http://localhost:3000/api/internships/INT-101"
```

To test validation, send a POST body with an empty title or unsupported mode; the API should return HTTP 400 and a JSON error.
