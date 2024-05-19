const { Pool } = require("pg");
require("dotenv").config(); // Ensures your environment variables are loaded from the .env file

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.POSTGRES_SSL ? { rejectUnauthorized: false } : false,
});

pool.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to database");
  }
});

module.exports = pool;
