var express = require('express');
var router = express.Router();
const mysql = require('mysql2');
const config = require('../config'); // Adjust the path if needed



/* GET users listing. */
router.get('/:id', function(req, res, next) {
  const con = mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name
  });

  var user_name = req.params.id;
  
  con.connect(function(err) {
    if (err) throw err;
    console.log('Connected');
  });
  const query = 'SELECT * FROM Users WHERE username =?';
  con.query(query, user_name, function(err, results) {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error retrieving data from the database');
      return;
    } else {
        if(results.length == 1){
          console.log(results, user_name)
          res.send(results);
        } else {
          res.send('USER NOT FOUND')
        }
    }
});
  
});

module.exports = router;
