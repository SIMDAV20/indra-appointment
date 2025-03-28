import mysql from 'mysql2/promise';

const poolPe = mysql.createPool({
  host: process.env.DB_HOST_PE,
  user: process.env.DB_USER_PE,
  password: process.env.DB_PASSWORD_PE,
  database: process.env.DB_NAME_PE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default poolPe;
