const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.URL_DB_CONNECT,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on('connect', () => {
    console.log('Connected to the database');
});

pool.on('error', (err:any) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export default pool;
