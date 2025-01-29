require('dotenv').config();
const { Pool, types } = require('pg');

// Parse BIGINT and INT as numbers
const parseIntValue = (value) => parseInt(value, 10);
types.setTypeParser(types.builtins.INT8, parseIntValue); // For BIGSERIAL/BIGINT
types.setTypeParser(types.builtins.INT4, parseIntValue); // For INTEGER

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  pool_mode: process.env.PG_POOL_MODE,
});

module.exports = pool;
