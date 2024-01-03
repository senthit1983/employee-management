import mysql, { Pool } from 'mysql2/promise';
import logger from '../../logger'
import dotenv from 'dotenv';

dotenv.config();
/** Access env properties for DB connection */
const pool: Pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 0
});

/** conncet to the Database */
// istanbul ignore next
async function connect() {
  try {
    const connection = await pool.getConnection();
    logger.writeLog('i', 'Connected to the database', '');
    return connection;
  } catch (error: any) {
    logger.writeLog('e', 'Error connecting to the database:', error);
    throw error;
  }
}

export { connect };
