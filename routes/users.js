require('dotenv').config()
var express = require('express');
var router = express.Router();
const mysql = require('mysql2');
const config = require('../config'); // Adjust the path if needed
const jwt = require('jsonwebtoken')



/* GET users listing. */
router.get('/:id', autheticateToken, function(req, res, next) {
  const con = mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name
  });

  const user_id = req.user.user_id
  console.log(req.user)

  
  con.connect(function(err) {
    if (err) throw err;
    console.log('Connected');
  });
  const query = 'SELECT * FROM Users WHERE user_id =?';
  const countQuery = 'SELECT COUNT(*) AS count FROM Reviews WHERE user_id =?';
  const bookIdQuery = 'SELECT Book.book_id, Book.imagelink FROM Reviews, Book WHERE Reviews.book_id = Book.book_id and Reviews.user_id = ?';
  
  con.query(query, user_id, function(err, results) {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error retrieving data from the database');
      return;
    } else {
        if(results.length == 1){
          console.log(results, user_id)
          con.query(countQuery, user_id, function(err, countResult) {
            if (err) {
              console.error('Error executing count query:', err);
              res.status(500).send('Error retrieving count from the database');
              return;
            } else {
              const count = countResult[0].count;
              results[0].review_count = count;
              con.query(bookIdQuery, user_id, function(err, bookIdResult) {
                if (err) {
                  console.error('Error executing book ID query:', err);
                  res.status(500).send('Error retrieving book ID from the database');
                  return;
                } else {
                  const bookId = bookIdResult[0].book_id;
                  results[0].book_id = bookId;
    
                  res.send(results);
                }
              });
            }
          });
          // res.send(results);
        } else {
          res.send('USER NOT FOUND')
        }
    }
});
  
});

router.get('/book/:id', (req ,res, next)=> {
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
  const query = 'SELECT COUNT(*) AS count FROM Reviews WHERE user_id =?';
  con.query(query, user_id, function(err, results) {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error retrieving data from the database');
      return;
    } else {
        if(results.length == 1){
          console.log(results, user_id)
          res.send(results);
        } else {
          res.send('USER NOT FOUND')
        }
    }
});


});

function autheticateToken(req,res,next) {
  console.log(req.params.id)
  const authHeader = req.headers['authorization']
  //const token = authHeader && authHeader.split(' ')[1] // authHeader가 있어야 리턴
  const token = req.params.id
  if(token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if(err) return res.sendStatus(403)
      req.user = user
      next()
  })
}

module.exports = router;
