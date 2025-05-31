import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config({
    path: './.env'
}); 

const pool = new Pool({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    ssl: {
        rejectUnauthorized: false,     
    },
    // port: parseInt(process.env.PG_PORT, 10),   // convert to number
    // database: process.env.PG_DATABASE,
});

pool.connect()
  .then(() => console.log('Connected to supabase!'))
  .catch(err => {
    console.error('Database connection error:', err.message);

});

export default pool;
