# MyRDBMS - Simple Relational Database Management System

A full-stack relational database management system built from scratch with a modern web interface. This project demonstrates a complete implementation of database internals including SQL parsing, indexing, CRUD operations, and persistence.


## Tech Stack

### Backend (API)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Custom RDBMS (in-memory with file persistence)

### Frontend (Web)
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **UI Library**: Mantine UI
- **State Management**: Zustand

### DevOps
- **Monorepo**: Turborepo with pnpm
- **Containerization**: Docker & Docker Compose
- **Package Manager**: pnpm

## Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd myrdbms
```

### 2. Install Dependencies

```bash
#install turbo globally
npm install turbo --global

# Install pnpm globally (if not already installed)
npm install -g pnpm

# Install all dependencies
pnpm install
```

### 3. Environment Configuration

#### Backend (apps/api/.env)
```env
NODE_ENV=development
PORT=3001
HOST_NAME=0.0.0.0
DATA_PATH=./data
```

#### Frontend (apps/web/.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

## Running the Project

### Development Mode (Local)

#### Option 1: Run All Services
```bash
# Start both frontend and backend in development mode
pnpm run dev
```

This will start:
- **API Server**: http://localhost:3001
- **Web Client**: http://localhost:3000

#### Option 2: Run Services Separately

Terminal 1 (Backend):
```bash
cd apps/api
pnpm run dev
```

Terminal 2 (Frontend):
```bash
cd apps/web
pnpm run dev
```

### Production Mode (Docker)

#### Build and Run with Docker Compose

```bash
# Build images and start containers
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

**Volumes**:
- `api_data` - Persists database files from `/app/data`

**Access URLs** (Docker):
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api/v1

## Interactive REPL

Access the database via command-line interface:

```bash
# From project root
pnpm run mydb

# Output
╔═══════════════════════════════════════════════════════════════╗
║              MyRDBMS - Interactive Database Shell              ║
║              Functional Relational Database System             ║
╚═══════════════════════════════════════════════════════════════╝

Type 'help' for available commands or 'exit' to quit

mydb>
```

```

## Postman Collection

Import the provided Postman collection for testing:

1. Open Postman
2. Click **Import**
3. Paste the collection JSON (provided in ./docs folder in the repo) 
4. Set variable `API_URL` to `http://localhost:3001/api/v1`


## Testing the System

### 1. Quick Test via REPL
```bash
pnpm run mydb

# In REPL
mydb> CREATE DATABASE testdb
mydb> USE testdb
testdb> CREATE TABLE products (id INTEGER PRIMARY KEY, name VARCHAR(100), price FLOAT)
testdb> INSERT INTO products (name, price) VALUES ('Laptop', 999.99)
testdb> SELECT * FROM products
```

### 2. Test via Web Interface
1. Navigate to http://localhost:3000
2. Create database "testdb"
3. Create table "products"
4. Use Query Console to insert/query data

### 3. Test via API (cURL)
```bash
# Create database
curl -X POST http://localhost:3001/api/v1/databases \
  -H "Content-Type: application/json" \
  -d '{"name":"testdb"}'

# Create table
curl -X POST http://localhost:3001/api/v1/tables \
  -H "Content-Type: application/json" \
  -d '{
    "name": "products",
    "columns": [
      {"name": "id", "type": "INTEGER", "primaryKey": true},
      {"name": "name", "type": "VARCHAR", "maxLength": 100},
      {"name": "price", "type": "FLOAT"}
    ]
  }'

# Execute query
curl -X POST http://localhost:3001/api/v1/query \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM products"}'
```

### Database Connection Issues
1. Ensure backend is running on port 3001
2. Check `.env.local` has correct API URL
3. Verify CORS settings in backend
4. Check browser console for errors


## Features

### Database Engine
- In-memory storage with file persistence
- Multiple databases support
- CREATE, DROP, USE database commands
- Automatic persistence on modifications

### Table Management
- CREATE TABLE with constraints
- DROP TABLE
- DESCRIBE table schema
- Support for PRIMARY KEY, UNIQUE constraints
- Data types: INTEGER, VARCHAR, BOOLEAN, FLOAT

### Query Support
- SELECT with WHERE clause
- INSERT INTO
- UPDATE with WHERE
- DELETE with WHERE
- INNER JOIN
- CREATE INDEX


## Performance Considerations

### Database
- **In-memory**: Fast read/write operations
- **Indexing**: O(1) lookups for indexed columns
- **Auto-save**: Async file writes don't block operations

### API
- **Functional Core**: Pure functions, easy to optimize
- **Middleware**: Lightweight request processing
- **Validation**: Early request validation with Zod

### Frontend
- **Next.js**: Optimized React rendering
- **Zustand**: Minimal state management overhead
- **Mantine**: Tree-shakeable component library

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { },
  "statusCode": 200
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

### Validation Error (Zod)
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "path": ["name"],
      "message": "Required"
    }
  ],
  "statusCode": 400
}
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - Feel free to use this project for learning and development.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check Docker logs
4. Open an issue on GitHub

---

**Built by Gerald with as a demonstration of database internals and full-stack development**