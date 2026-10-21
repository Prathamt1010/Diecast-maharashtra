const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "diecastmh_db",
  password: "Pratham",
  port: 5432,
});

module.exports = pool;