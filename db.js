const { Pool } = require("pg");

var connectionstring = process.env.NODE_ENV==='development' ? 
"postgresql://postgres:postgres@localhost:5433/postgres":
"postgresql://postgres:postgres@172.17.0.1:5432/postgres"


const pool = new Pool({
  connectionString: connectionstring
});

module.exports = pool;

