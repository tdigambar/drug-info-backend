const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
const dbPath = path.join(__dirname, 'drugs.db');
let db;

try {
  db = new Database(dbPath);
  // Check if table exists
  const tableExists = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name='drugs'
  `).get();
  
  if (!tableExists) {
    console.warn('Warning: drugs table does not exist. Please run: npm run seed');
  }
} catch (error) {
  console.error('Error initializing database:', error.message);
  process.exit(1);
}

// Table configuration endpoint
app.get('/api/table-config', (req, res) => {
  const config = {
    columns: [
      { id: 'id', label: 'Id', sortable: false },
      { id: 'code', label: 'Code', sortable: true },
      { id: 'name', label: 'Name', sortable: true },
      { id: 'company', label: 'Company', sortable: true },
      { id: 'launchDate', label: 'Launch Date', sortable: true }
    ]
  };
  res.json(config);
});

// Get all distinct companies
app.get('/api/companies', (req, res) => {
  const companies = db.prepare('SELECT DISTINCT company FROM drugs ORDER BY company').all();
  res.json(companies.map(row => row.company));
});

// Get drug data endpoint
app.get('/api/drugs', (req, res) => {
  const company = req.query.company;
  
  let query = `
    SELECT 
      id,
      code,
      genericName,
      brandName,
      company,
      launchDate
    FROM drugs
  `;
  
  const params = [];
  
  if (company && company !== 'all') {
    query += ' WHERE company = ?';
    params.push(company);
  }
  
  query += ' ORDER BY launchDate DESC';
  
  const stmt = db.prepare(query);
  const drugs = stmt.all(...params);
  
  res.json(drugs);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

