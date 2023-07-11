var express = require('express');
var router = express.Router();
const mysql = require('mysql2');
const config = require('../config'); // Adjust the path if needed



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
  const query = 'SELECT Reviews.user_id, Reviews.book_id, Reviews.meeting_id, Reviews.content_id, Contents.content, Reviews.rating, Books.book_title, Users.user_name FROM Reviews ' +
  'JOIN Contents ON Reviews.content_id = Contents.content_id ' +
  'JOIN Books ON Reviews.book_id = Books.book_id ' +
  'JOIN Users ON Reviews.user_id = Users.user_id ' +
  'ORDER BY Reviews.end_date DESC LIMIT 10';
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
