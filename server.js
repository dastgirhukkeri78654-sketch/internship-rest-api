const express = require('express');
const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');


const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'internships.sqlite');

app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json({ limit: '10kb' }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Too many requests. Please try again later.'
    }
  }
});

app.use('/api', apiLimiter);

let db;


function saveDatabase() {
  fs.writeFileSync(DB_FILE, Buffer.from(db.export()));
}
function errorResponse(res, status, message, details) {
  const error = { success: false, error: { message } };
  if (details) error.error.details = details;
  return res.status(status).json(error);
}
function toRecord(row) {
  return { id: row[0], title: row[1], domain: row[2], mode: row[3], location: row[4], durationWeeks: row[5], openings: row[6], applicationsOpen: Boolean(row[7]) };
}
function getRecord(id) {
  const stmt = db.prepare('SELECT id,title,domain,mode,location,duration_weeks,openings,applications_open FROM internships WHERE id=?');
  stmt.bind([id]);
  const found = stmt.step() ? toRecord(stmt.get()) : null;
  stmt.free();
  return found;
}
function validate(input, partial = false) {
  const errors = [];
  const fields = ['title','domain','mode','location','durationWeeks','openings','applicationsOpen'];
  if (!input || typeof input !== 'object' || Array.isArray(input)) return ['Request body must be a JSON object.'];
  if (!partial) for (const field of fields) if (!(field in input)) errors.push(`${field} is required.`);
  for (const field of ['title','domain','mode','location']) {
    if (field in input && (typeof input[field] !== 'string' || !input[field].trim())) errors.push(`${field} must be a non-empty string.`);
    if (field in input && typeof input[field] === 'string' && input[field].trim().length > 100) errors.push(`${field} must be 100 characters or fewer.`);
  }
  if ('mode' in input && !['Remote','Hybrid','On-site'].includes(input.mode)) errors.push('mode must be Remote, Hybrid, or On-site.');
  if ('durationWeeks' in input && (!Number.isInteger(input.durationWeeks) || input.durationWeeks < 1 || input.durationWeeks > 104)) errors.push('durationWeeks must be an integer from 1 to 104.');
  if ('openings' in input && (!Number.isInteger(input.openings) || input.openings < 0 || input.openings > 10000)) errors.push('openings must be an integer from 0 to 10000.');
  if ('applicationsOpen' in input && typeof input.applicationsOpen !== 'boolean') errors.push('applicationsOpen must be true or false.');
  return errors;
}
function setupDatabase() {
  db.run(`CREATE TABLE IF NOT EXISTS internships (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, domain TEXT NOT NULL,
    mode TEXT NOT NULL CHECK(mode IN ('Remote','Hybrid','On-site')),
    location TEXT NOT NULL, duration_weeks INTEGER NOT NULL CHECK(duration_weeks BETWEEN 1 AND 104),
    openings INTEGER NOT NULL CHECK(openings BETWEEN 0 AND 10000),
    applications_open INTEGER NOT NULL DEFAULT 1 CHECK(applications_open IN (0,1)),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);
  const count = db.exec('SELECT COUNT(*) FROM internships')[0].values[0][0];
  if (count === 0) {
    const records = [
      ['INT-101','Frontend Intern','Full Stack Development','Remote','India',4,3,1],
      ['INT-102','API Engineering Intern','Full Stack Development','Hybrid','Pune',8,2,1],
      ['INT-103','UI/UX Intern','UI/UX','Remote','India',4,1,1],
      ['INT-104','Data Analyst Intern','Data Analytics','On-site','Bengaluru',6,2,1],
      ['INT-105','Security Operations Intern','Cyber Security','Remote','India',8,1,1]
    ];
    const stmt = db.prepare('INSERT INTO internships (id,title,domain,mode,location,duration_weeks,openings,applications_open) VALUES (?,?,?,?,?,?,?,?)');
    for (const record of records) stmt.run(record);
    stmt.free();
  }
  
  db.run(`CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    applicant_name TEXT NOT NULL,
    email TEXT NOT NULL,
    internship_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (internship_id) REFERENCES internships(id)
  )`);

  saveDatabase();
}

app.get('/', (req,res) => res.json({ name:'Internship REST API', version:'1.0.0', docs:'/api', health:'/api/health' }));

app.get('/api', (req, res) => res.json({
  success: true,
  endpoints: {
    health: 'GET /api/health',
    list: 'GET /api/internships?page=1&limit=10',
    detail: 'GET /api/internships/:id',
    create: 'POST /api/internships',
    update: 'PUT /api/internships/:id',
    delete: 'DELETE /api/internships/:id',
    applications: 'POST /api/applications'
  },
  requiredFields: [
    'title',
    'domain',
    'mode',
    'location',
    'durationWeeks',
    'openings',
    'applicationsOpen'
  ]
}));

app.get('/api/health', (req,res) => res.json({ success:true, status:'ok', database:'connected' }));

app.get('/api/internships', (req,res) => {
  const page = Number.parseInt(req.query.page ?? '1',10);
  const limit = Number.parseInt(req.query.limit ?? '10',10);
  if (!Number.isInteger(page) || page < 1) return errorResponse(res,400,'page must be a positive integer.');
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) return errorResponse(res,400,'limit must be an integer from 1 to 100.');
  const total = db.exec('SELECT COUNT(*) FROM internships')[0].values[0][0];
  const stmt = db.prepare('SELECT id,title,domain,mode,location,duration_weeks,openings,applications_open FROM internships ORDER BY id LIMIT ? OFFSET ?');
  stmt.bind([limit,(page-1)*limit]);
  const data=[]; while(stmt.step()) data.push(toRecord(stmt.get())); stmt.free();
  res.json({ success:true, data, pagination:{ page, limit, total, totalPages:Math.ceil(total/limit) } });
});
app.get('/api/internships/:id', (req,res) => {
  const record=getRecord(req.params.id);
  if (!record) return errorResponse(res,404,'Internship not found.');
  res.json({ success:true, data:record });
});
app.post('/api/internships', (req,res) => {
  const errors=validate(req.body);
  if(errors.length) return errorResponse(res,400,'Validation failed.',errors);
  const id=`INT-${Date.now()}`, x=req.body;
  const stmt=db.prepare('INSERT INTO internships (id,title,domain,mode,location,duration_weeks,openings,applications_open) VALUES (?,?,?,?,?,?,?,?)');
  stmt.run([id,x.title.trim(),x.domain.trim(),x.mode,x.location.trim(),x.durationWeeks,x.openings,x.applicationsOpen?1:0]); stmt.free(); saveDatabase();
  res.status(201).json({ success:true, data:getRecord(id) });
});
app.put('/api/internships/:id', (req,res) => {
  const current=getRecord(req.params.id);
  if(!current) return errorResponse(res,404,'Internship not found.');
  const allowed=['title','domain','mode','location','durationWeeks','openings','applicationsOpen'];
  const unknown=Object.keys(req.body||{}).filter(k=>!allowed.includes(k));
  if(unknown.length) return errorResponse(res,400,'Unknown field(s) supplied.',unknown);
  const merged={...current,...req.body}, errors=validate(merged);
  if(errors.length) return errorResponse(res,400,'Validation failed.',errors);
  const stmt=db.prepare('UPDATE internships SET title=?,domain=?,mode=?,location=?,duration_weeks=?,openings=?,applications_open=?,updated_at=CURRENT_TIMESTAMP WHERE id=?');
  stmt.run([merged.title.trim(),merged.domain.trim(),merged.mode,merged.location.trim(),merged.durationWeeks,merged.openings,merged.applicationsOpen?1:0,req.params.id]); stmt.free(); saveDatabase();
  res.json({ success:true, data:getRecord(req.params.id) });
});
app.delete('/api/internships/:id', (req,res) => {
  const current=getRecord(req.params.id);
  if(!current) return errorResponse(res,404,'Internship not found.');
  const stmt=db.prepare('DELETE FROM internships WHERE id=?'); stmt.run([req.params.id]); stmt.free(); saveDatabase();
  res.json({ success:true, message:'Internship deleted.', data:current });
});

app.post('/api/applications', (req, res) => {
  const { applicantName, email, internshipId } = req.body || {};

  const allowedFields = ['applicantName', 'email', 'internshipId'];
  const unknownFields = Object.keys(req.body || {})
    .filter(key => !allowedFields.includes(key));

  if (unknownFields.length) {
    return errorResponse(res, 400, 'Unknown field(s) supplied.', unknownFields);
  }

  const errors = [];

  if (typeof applicantName !== 'string' ||
      applicantName.trim().length < 2 ||
      applicantName.trim().length > 100) {
    errors.push('applicantName must be 2 to 100 characters.');
  }

  if (typeof email !== 'string' ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('A valid email address is required.');
  }

  if (typeof internshipId !== 'string' ||
      internshipId.trim().length === 0 ||
      internshipId.length > 50) {
    errors.push('internshipId is required.');
  }

  if (errors.length) {
    return errorResponse(res, 400, 'Validation failed.', errors);
  }

  const internship = getRecord(internshipId.trim());

  if (!internship) {
    return errorResponse(res, 404, 'Internship not found.');
  }

  if (!internship.applicationsOpen) {
    return errorResponse(res, 400, 'Applications are closed for this internship.');
  }

  if (internship.openings < 1) {
    return errorResponse(res, 400, 'No openings are currently available.');
  }

  const stmt = db.prepare(
    'INSERT INTO applications (applicant_name, email, internship_id) VALUES (?, ?, ?)'
  );

  try {
    stmt.run([
      applicantName.trim(),
      email.trim().toLowerCase(),
      internshipId.trim()
    ]);
    stmt.free();
    saveDatabase();

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully.'
    });
  } catch (error) {
    stmt.free();
    console.error('Application save failed:', error);
    return errorResponse(res, 500, 'Could not save the application.');
  }
});

app.use((req,res)=>errorResponse(res,404,'Route not found.'));
app.use((err,req,res,next)=>{
  if(err instanceof SyntaxError && 'body' in err) return errorResponse(res,400,'Invalid JSON body.');
  console.error(err); return errorResponse(res,500,'Internal server error.');
});

async function start() {
  const SQL=await initSqlJs();
  db=fs.existsSync(DB_FILE) ? new SQL.Database(fs.readFileSync(DB_FILE)) : new SQL.Database();
  setupDatabase();
  app.listen(PORT,()=>console.log(`Internship REST API running at http://localhost:${PORT}\nAPI guide: http://localhost:${PORT}/api`));
}
start().catch(err=>{ console.error('Could not start the API:',err); process.exit(1); });
