require('dotenv').config()

var express = require('express');
var router = express.Router();
const axios = require('axios');
const qs = require('qs');
const mysql = require('mysql2');
const config = require('../config'); 
const jwt = require('jsonwebtoken')




// const kakao = {
//     clientID: 'b666c0101243c203e7f78c1aa9542c61',
//     clientSecret: 'FylBXq0mfUflist3lPIcA8DrusPzMdO4',
//     redirectUri: 'http://172.10.5.121:443/auth/kakao/callback'
//   }

const kakao = config.kakao
const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao.clientID}&redirect_uri=${kakao.redirectUri}&response_type=code`;
/* GET home page. */
// router.get('/kakao', function(req, res, next) {
//     res.redirect(kakaoAuthURL);
// });

router.get('/success/:token', autheticateToken, (req,res)=>{
    console.log(req.params.token)
    res.json(req.user);
})

router.get('/kakao',(req,res)=>{
    res.redirect(kakaoAuthURL);
})

router.get('/kakao/callback', async(req,res)=>{
    var code = req.query.code
    console.log(code)
    try{//access토큰을 받기 위한 코드
      token = await axios({//token
          method: 'POST',
          url: 'https://kauth.kakao.com/oauth/token',
          headers:{
              'content-type':'application/x-www-form-urlencoded'
          },
          data:qs.stringify({
              grant_type: 'authorization_code',//특정 스트링
              client_id:kakao.clientID,
              client_secret:kakao.clientSecret,
              redirectUri:kakao.redirectUri,
              code: code,//결과값을 반환했다. 안됐다.
          })//객체를 string 으로 변환
      })
  }catch(err){
    console.log(err)
  };
  
  let user;
      try{
          // console.log(token); //access정보를 가지고 또 요청해야 정보를 가져올 수 있음.
          user = await axios({
              method:'get',
              url:'https://kapi.kakao.com/v2/user/me',
              headers:{
                  Authorization: `Bearer ${token.data.access_token}`
              }//헤더에 내용을 보고 보내주겠다.
          })
      }catch(e){
          console.log(e)
      }
      console.log(user.data);
      console.log(user.data.id)
      console.log(user.data.properties)

      var user_id = user.data.id
      var username = user.data.properties.nickname
      var profile_image = user.data.properties.profile_image
      var thumbnail_image = user.data.properties.thumbnail_image


      const con = mysql.createConnection({
        host: config.database.host,
        user: config.database.user,
        password: config.database.password,
        database: config.database.name
      })
      
      con.connect(function(err) {
        if (err) throw err;
        console.log('Connected');
      });
      const query = 'SELECT * FROM Users WHERE user_id=?';
      con.query(query, user_id, function(err, results) { // User 정보를 내부 DB 에 접근해서 찾아본다.
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).send('Error retrieving data from the database');// 내부 DB error 핸들링
          return;
        } 
        
        else 
        {
            if (results.length == 0){ // 유저가 내부 DB에 없는 경우 자동으로 회원가입을 시켜버린다 강제임 ㅋㅋ

                const insertQuery = 'INSERT INTO Users (user_id, username, profile_image, thumbnail_image) VALUES (?, ?, ?, ?)';
                con.query(insertQuery, [user_id, username, profile_image, thumbnail_image], function(err, insertResult) {
                    if (err) {
                        console.error('Error executing insert query:', err);
                        res.status(500).send('Error inserting data into the database');
                    } else {
                        console.log('User inserted successfully');
                        res.redirect('/auth/success/' + user_id);
                    }
                });


            } else { // 유저가 DB에 있는 경우, 이미 우리 회원이므로 정보 추출
                console.log(results)
                const ouruser = { user_id: user_id }
                const access_token = jwt.sign(ouruser, process.env.ACCESS_TOKEN_SECRET)
                console.log(access_token)
                // res.redirect('/auth/success/' + user_id);
                // res.json({access_token : access_token})
                // res.set('Authorization', access_token)
                res.redirect('/auth/success'+ access_token)
            }
            
        }
      });
      
      // res.redirect('/');
    })

function autheticateToken(req,res,next) {
    console.log(req.headers)
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // authHeader가 있어야 리턴
    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}
  

module.exports = router;
