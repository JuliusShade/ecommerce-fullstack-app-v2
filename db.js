const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.PSQL_USER,
  host: process.env.PSQL_HOST,
  database: process.env.PSQL_DATABASE,
  password: process.env.PSQL_PASSWORD,
  port: process.env.PSQL_PORT,
  ssl: {
    rejectUnauthorized: false, // Note: Setting this to false will allow connections without SSL certificates. Use true for production.
  },
});

module.exports = pool;
