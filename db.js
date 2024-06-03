const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool
  .connect()
  .then((client) => {
    console.log("Connected to the database");
    client.release();
  })
  .catch((err) => {
    console.error("Error connecting to the database", err.stack);
  });

module.exports = {
  query: (text, params) => pool.query(text, params),
};
