const { Pool } = require("pg");

var connectionstring = process.env.NODE_ENV==='development' ? 
"postgresql://postgres:postgres@localhost:5433/postgres":
"postgresql://postgres:postgres@db:5432/postgres"


const pool = new Pool({
  connectionString: connectionstring
});

module.exports = pool;

