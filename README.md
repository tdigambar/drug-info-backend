# Drug Info Backend

Backend API server for the Drug Info application.

## Setup

1. Switch to Node.js 20 (if using nvm):
```bash
nvm use
```

2. Install dependencies:
```bash
npm install
```

3. Seed the database:
```bash
npm run seed
```

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/table-config` - Get table configuration
- `GET /api/companies` - Get all distinct company names
- `GET /api/drugs?company=<company_name>` - Get drug data (optionally filtered by company)

