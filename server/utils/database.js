const dotenv = require("dotenv");
dotenv.config();
const mysql = require("mysql2");

const pool = mysql.createPool({
    host: process.env.ROULETTE_DB_HOST,
    user: process.env.ROULETTE_DB_USER,
    database: process.env.ROULETTE_DB_NAME,
    password: process.env.ROULETTE_DB_PASSWORD,
});

module.exports = pool.promise();
