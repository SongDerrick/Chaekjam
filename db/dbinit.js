const port = 3000

const mysql = require('mysql2');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Lonzoball@2',
  database: 'Chaekjam'
});

con.connect(function(err) {
  if (err) throw err;
  console.log('Connected');
});

const query = 'SELECT * FROM Meeting';
con.query(query, function(err, results) {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error retrieving data from the database');
      return;
    } else {
        console.log(results)
    }
});