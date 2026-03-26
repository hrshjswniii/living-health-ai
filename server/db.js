import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper for initial database creation
export const initDb = async () => {
  try {
    // Connect without DB selected to create it if not exists
    const initPool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    
    const schemaPath = path.resolve('schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);
      
      for (let statement of statements) {
        await initPool.query(statement);
      }
      console.log('Database and tables initialized.');
    }
  } catch (err) {
    console.error('Failed to initialize database:', err);
  }
};

export default pool;
