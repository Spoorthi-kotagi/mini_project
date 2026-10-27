const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "ecart_db",
    password: process.env.DB_PASSWORD,
    port: 5432,
});

pool.on("connect", () => {
    console.log("Connected to PostgreSQL");
});

pool.on("error", (err) => {
    console.error("Unexpected PostgreSQL error:", err.message);
});

module.exports = pool;