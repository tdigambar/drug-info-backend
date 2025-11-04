const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'drugs.db');
const db = new Database(dbPath);

// Create table
db.exec(`
  CREATE TABLE IF NOT EXISTS drugs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL,
    genericName TEXT NOT NULL,
    brandName TEXT,
    company TEXT NOT NULL,
    launchDate TEXT NOT NULL
  )
`);

// Read drug data from JSON file
const dataFilePath = path.join(__dirname, '..', 'drugData 2025.json');
let drugData = [];

try {
  const fileContent = fs.readFileSync(dataFilePath, 'utf8');
  drugData = JSON.parse(fileContent);
  console.log(`Loaded ${drugData.length} drug records from JSON file`);
} catch (error) {
  console.error('Error reading drug data file:', error.message);
  console.error('Please make sure "drugData 2025.json" exists in the backend directory');
  process.exit(1);
}

// Clear existing data
db.prepare('DELETE FROM drugs').run();

// Insert drug data
const insert = db.prepare(`
  INSERT INTO drugs (code, genericName, brandName, company, launchDate)
  VALUES (?, ?, ?, ?, ?)
`);

const insertMany = db.transaction((drugs) => {
  for (const drug of drugs) {
    insert.run(
      drug.code,
      drug.genericName,
      drug.brandName || null,
      drug.company,
      drug.launchDate
    );
  }
});

insertMany(drugData);

console.log(`Seeded ${drugData.length} drugs into the database`);
db.close();
