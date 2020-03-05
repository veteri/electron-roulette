const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "roulette",
    password: "1911"
});

module.exports = pool.promise();
