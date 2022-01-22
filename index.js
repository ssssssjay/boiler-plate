// 익스프레스 사용을 위한
const express = require('express');
const app = express();
const port = 8080;
const bodyParser = require('body-parser'); // 인스톨은 안해도 선언은 해야함

const config = require('./config/key');

const {User} = require('./models/User');

// application/x-www-form-urlencoded 요런애를 분석하는
app.use(bodyParser.urlencoded({extended: true}));
// application/json 얘를 분석하는
app.use(bodyParser.json());

// 몽고디비를 편하게 쓰게해주는 몽구스! 설치필요
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {

}).then(() => console.log('mongoDB Connected!'))
  .catch(err => console.log(err));



app.get('/', (req, res, next) => {res.send('우히히히히히')});


app.post('/register', (req, res, next) => {
  // 회원가입할때필요한 정보들을 클라이언트에서 가져오면 그것들을 디비에 넣어준다
  const user = new User(req.body)
  // 몽고디비에서 오는 메소드임
  user.save((err, userInfo) => {
    if(err) return res.json({ success: false, err})
    return res.status(200).json({
      success: true
    })
  })
})

app.listen(port, () => console.log(`${port} listen`));