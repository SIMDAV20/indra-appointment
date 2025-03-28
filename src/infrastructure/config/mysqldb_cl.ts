import mysql from 'mysql2/promise';

const poolCl = mysql.createPool({
  host: process.env.DB_HOST_CL,
  user: process.env.DB_USER_CL,
  password: process.env.DB_PASSWORD_CL,
  database: process.env.DB_NAME_CL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default poolCl;
