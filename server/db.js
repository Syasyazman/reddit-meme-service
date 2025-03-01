require("dotenv").config();
const { Pool } = require('pg');

// const pool = async () => {
//     const dbConfig = {
//         user: process.env.DB_USERNAME,
//         password: process.env.DB_PASSWORD,
//         host: process.env.DB_HOST,
//         port: process.env.DB_PORT,
//         database: process.env.DB_DATABASENAME
//     }
    
//     const pool = new Pool(dbConfig);

//     // test database connection
//     try {
//         const client = await pool.connect();

//         await client.query(`SELECT NOW()`);
//         console.log('Successfully connected to database');
//     } catch (error) {
//         console.error('Error connecting to database', error);
//     }

//     return pool;
// }

const pool = new Pool({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASENAME
});

module.exports = pool;