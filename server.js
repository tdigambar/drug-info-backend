const express = require('express');
const cors = require('cors');
const { getAllCompanies, getDrugs } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

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
  try {
    const companies = getAllCompanies();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// Get drug data endpoint
app.get('/api/drugs', (req, res) => {
  try {
    const company = req.query.company;
    const drugs = getDrugs(company);
    res.json(drugs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch drugs' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

