// 익스프레스 사용을 위한
const express = require('express');
const app = express();
const port = 8080;
const bodyParser = require('body-parser'); // 인스톨은 안해도 선언은 해야함
const cookieParser = require('cookie-parser');
const {auth} = require('./middleware/auth');
const config = require('./config/key');

const {User} = require('./models/User');

// application/x-www-form-urlencoded 요런애를 분석하는
app.use(bodyParser.urlencoded({extended: true}));
// application/json 얘를 분석하는
app.use(bodyParser.json());
app.use(cookieParser());

// 몽고디비를 편하게 쓰게해주는 몽구스! 설치필요
const mongoose = require('mongoose');
const { append } = require('express/lib/response');
const req = require('express/lib/request');
const res = require('express/lib/response');
mongoose.connect(config.mongoURI, {

}).then(() => console.log('mongoDB Connected!'))
  .catch(err => console.log(err));



app.get('/', (req, res, next) => {res.send('우히히히히히')});

// 회원가입 라우트
app.post('/api/users/register', (req, res, next) => {
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

// 로그인 라우트
app.post('/api/users/login', (req, res, next) => {
  // 요청된 이메일을 디비에서 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "해당하는 이메일은 가입되어있지 않습니다."
      })
    }
    // 이메일을 찾았으면 비밀번호를 체킹하기 comparePassword는 유저 스키마에서 만들거임
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})

      // 비밀번호가 맞다면 토큰생성
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);
        
        // 토큰을 저장한다. 어디에 ? => 쿠키. 로컬스토리지. 세션스토리지? install cookie-parser
          res.cookie("x_auth", user.token)
            .status(200)
            .json({ loginSuccess: true, userId: user._id})
      })
    })
  })
})
// role 1 admin role 0 일반유저
// 유저인증 라우트? 이 회원이 특정페이지(게시물)에 접근가능한 유저인지 파악
app.get('/api/users/auth', auth, (req, res) => {

  // 여기까지 미들웨어를 통과해왔다는 얘기는 유저인증이 트루(잘되었다 토큰도있고 그게 유저랑도 일치하고 안심할 유저라는 뜻)
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res) => {

  User.findOneAndUpdate(
    {_id: req.user._id},
    {token: ''},
    (err, user) => {
      if (err) return res.json({success: false, err});
      return res.status(200).send({
        success: true
      })
    }
  )
})

app.listen(port, () => console.log(`${port} listen`));