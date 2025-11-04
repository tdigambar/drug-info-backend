const Database = require('better-sqlite3');
const path = require('path');

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

/**
 * Get all distinct companies from the database
 * @returns {string[]} Array of company names
 */
function getAllCompanies() {
  const companies = db.prepare('SELECT DISTINCT company FROM drugs ORDER BY company').all();
  return companies.map(row => row.company);
}

/**
 * Get drugs from the database, optionally filtered by company
 * @param {string|null} company - Company name to filter by, or null for all companies
 * @returns {Array} Array of drug objects
 */
function getDrugs(company = null) {
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
  return stmt.all(...params);
}

module.exports = {
  db,
  getAllCompanies,
  getDrugs
};

