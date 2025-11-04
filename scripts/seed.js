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

// Sample drug data (based on the example provided)
const sampleDrugs = [
  {
    code: '0006-0568',
    genericName: 'vorinostat',
    brandName: 'ZOLINZA',
    company: 'Merck Sharp & Dohme Corp.',
    launchDate: '2004-02-14T23:01:10Z'
  },
  {
    code: '0006-0100',
    genericName: 'aspirin',
    brandName: 'BAYER',
    company: 'Bayer AG',
    launchDate: '1899-03-06T00:00:00Z'
  },
  {
    code: '0006-0123',
    genericName: 'metformin',
    brandName: 'GLUCOPHAGE',
    company: 'Merck Sharp & Dohme Corp.',
    launchDate: '1995-12-29T00:00:00Z'
  },
  {
    code: '0006-0456',
    genericName: 'atorvastatin',
    brandName: 'LIPITOR',
    company: 'Pfizer Inc.',
    launchDate: '1997-01-15T00:00:00Z'
  },
  {
    code: '0006-0789',
    genericName: 'lisinopril',
    brandName: 'PRINIVIL',
    company: 'Merck Sharp & Dohme Corp.',
    launchDate: '1987-12-29T00:00:00Z'
  },
  {
    code: '0006-0321',
    genericName: 'amlodipine',
    brandName: 'NORVASC',
    company: 'Pfizer Inc.',
    launchDate: '1992-07-01T00:00:00Z'
  },
  {
    code: '0006-0654',
    genericName: 'omeprazole',
    brandName: 'PRILOSEC',
    company: 'AstraZeneca',
    launchDate: '1989-09-01T00:00:00Z'
  },
  {
    code: '0006-0987',
    genericName: 'simvastatin',
    brandName: 'ZOCOR',
    company: 'Merck Sharp & Dohme Corp.',
    launchDate: '1991-12-23T00:00:00Z'
  },
  {
    code: '0006-0147',
    genericName: 'levothyroxine',
    brandName: 'SYNTHROID',
    company: 'AbbVie Inc.',
    launchDate: '2002-08-01T00:00:00Z'
  },
  {
    code: '0006-0258',
    genericName: 'azithromycin',
    brandName: 'ZITHROMAX',
    company: 'Pfizer Inc.',
    launchDate: '1992-02-01T00:00:00Z'
  },
  {
    code: '0006-0369',
    genericName: 'amoxicillin',
    brandName: 'AMOXIL',
    company: 'GlaxoSmithKline',
    launchDate: '1972-01-01T00:00:00Z'
  },
  {
    code: '0006-0741',
    genericName: 'gabapentin',
    brandName: 'NEURONTIN',
    company: 'Pfizer Inc.',
    launchDate: '1994-12-01T00:00:00Z'
  },
  {
    code: '0006-0852',
    genericName: 'hydrochlorothiazide',
    brandName: 'MICROZIDE',
    company: 'Mylan Pharmaceuticals Inc.',
    launchDate: '1959-01-01T00:00:00Z'
  },
  {
    code: '0006-0963',
    genericName: 'furosemide',
    brandName: 'LASIX',
    company: 'Sanofi',
    launchDate: '1966-01-01T00:00:00Z'
  },
  {
    code: '0006-0159',
    genericName: 'metoprolol',
    brandName: 'LOPRESSOR',
    company: 'Novartis Pharmaceuticals',
    launchDate: '1978-01-01T00:00:00Z'
  }
];

// Clear existing data
db.prepare('DELETE FROM drugs').run();

// Insert sample drugs
const insert = db.prepare(`
  INSERT INTO drugs (code, genericName, brandName, company, launchDate)
  VALUES (?, ?, ?, ?, ?)
`);

const insertMany = db.transaction((drugs) => {
  for (const drug of drugs) {
    insert.run(drug.code, drug.genericName, drug.brandName, drug.company, drug.launchDate);
  }
});

insertMany(sampleDrugs);

console.log(`Seeded ${sampleDrugs.length} drugs into the database`);
db.close();

