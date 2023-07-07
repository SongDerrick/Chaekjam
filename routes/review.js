var express = require('express');
var router = express.Router();
const mysql = require('mysql2');
const config = require('../congfig'); // Adjust the path if needed



/* GET users listing. */
router.get('/', function(req, res, next) {
  const con = mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name
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
        res.send(results);
    }
});
  
});

module.exports = router;
