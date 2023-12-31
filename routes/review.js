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
  const query = 'SELECT Reviews.user_id, Reviews.book_id, Reviews.meeting_id, Reviews.content_id, Contents.content, Contents.rating, Book.title, Book.imagelink, Users.username FROM Reviews ' +
  'JOIN Contents ON Reviews.content_id = Contents.content_id ' +
  'JOIN Book ON Reviews.book_id = Book.book_id ' +
  'JOIN Users ON Reviews.user_id = Users.user_id ' +
  'ORDER BY Reviews.end_date DESC LIMIT 20';
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

router.get('/:id', function(req, res, next) {

  console.log(req.params.id)
  var user_id = req.params.id
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
  const query = 'SELECT Reviews.user_id, Reviews.book_id, Reviews.meeting_id, Reviews.content_id, Contents.content, Contents.rating, Book.title, Book.imagelink, Users.username FROM Reviews ' +
  'JOIN Contents ON Reviews.content_id = Contents.content_id ' +
  'JOIN Book ON Reviews.book_id = Book.book_id ' +
  'JOIN Users ON Reviews.user_id = Users.user_id ' +
  'WHERE Reviews.user_id = ? ' + 
  'ORDER BY Reviews.end_date DESC LIMIT 10';
  con.query(query, user_id, function(err, results) {
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
