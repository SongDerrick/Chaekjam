var express = require('express');
var router = express.Router();
const axios = require('axios');
const qs = require('qs');

const kakao = {
    clientID: 'b666c0101243c203e7f78c1aa9542c61',
    clientSecret: 'FylBXq0mfUflist3lPIcA8DrusPzMdO4',
    redirectUri: 'http://172.10.5.121:443/auth/kakao/callback'
  }
const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao.clientID}&redirect_uri=${kakao.redirectUri}&response_type=code`;
/* GET home page. */
// router.get('/kakao', function(req, res, next) {
//     res.redirect(kakaoAuthURL);
// });

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
      console.log(user);
   
      // req.session.kakao = user.data;
      //req.session = {['kakao'] : user.data};
      
      res.redirect('/');
    })
  

module.exports = router;
