const { Client } = require('pg');

module.exports = () => {
    const dbConfig = {
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASENAME
    }
    
    try {
        const client = new Client(dbConfig);
    
        client
            .connect()
            .then(() => {
                console.log('Successfully connected to database');
            })
    } catch (error) {
        console.error('Error connecting to database', error);
    }
}