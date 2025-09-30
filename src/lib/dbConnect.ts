// /lib/dbConnect.ts
import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: process.env.MYSQL_HOST!,
  user: process.env.MYSQL_USER!,
  password: process.env.MYSQL_PASSWORD!,
  database: process.env.MYSQL_DB!,
  waitForConnections: true,
  connectionLimit: 10, // avoid overload
  queueLimit: 0
});

export default db;
