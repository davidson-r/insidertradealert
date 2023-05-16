const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://postgres:postgres@localhost:5433/postgres" //+ "?ssl=true",
});

module.exports = pool;



