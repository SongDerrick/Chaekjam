const port = 3000

const mysql = require('mysql2');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Lonzoball@2',
  database: 'local_db'
});

con.connect(function(err) {
  if (err) throw err;
  console.log('Connected');
});