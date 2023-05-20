const { Pool } = require("pg");

var port = process.env.NODE_ENV==='development' ? 5433  : 5432

const pool = new Pool({
  connectionString: `postgresql://postgres:postgres@localhost:${port}/postgres`
});

module.exports = pool;

console.log("port",port)