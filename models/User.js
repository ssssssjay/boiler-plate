const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
// Salt를 이용해서 비밀번호를 암호화 해야 해요
// 그럴려면 salt를 먼저 생성해야함
// saltRounds는 salt가 몇글자인지를 말하는거임
const jwt = require('jsonwebtoken');
// var token = jwt.sign({ foo: 'bar' }, 'shhhhh');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email : {
    type: String,
    trim: true, // space(공백)을 없애주는 역할
    unique: 1
  },
  password: {
    type: String,
    minlength: 5
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  role : { // 일반유저 관리자 뭐 요런식임 1은 뭐뭐 2는 뭐뭐 이렇게
    type: Number,
    default: 0
  },
  image: String,
  token: {
    type: String
  },
  tokenExp: {
    type: Number
  }
});

// 인덱스에서 라우터를 보면 user.save를 해주는데 고걸 해주기 전에 전처리를 해준다
userSchema.pre('save', function(next) {
  let user = this;

  if (user.isModified('password')) { // 비밀번호를 바꿀때만 해쉬화 시키기?
    // 비밀번호를 암호화시킨다
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if(err) return next(err)
      
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err)
        // 재할당
        user.password = hash;
        next()
      });
    });
  } else { // 이거는 비번바꾸기가 아닌 다른걸 했을때 그냥 나가게 해주는 처리
    next()
  }
})
// 비번 비교
userSchema.methods.comparePassword = function(plainPassword, cb) {
  // plainpassword 123456789 암호화된거는 긴거 블라블라
  bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
    if (err) return cb(err)
    cb(null, isMatch)
  })
}
// 토큰생성
userSchema.methods.generateToken = function(cb) {
  let user = this;
  // jsonwebtoken을 이용해 토큰만들기
  let token = jwt.sign(user._id.toHexString(), 'secretToken')

  user.token = token
  user.save(function(err, user) {
    if(err) return cb(err)
    cb(null, user)
  })
}
// 토큰으로 비교
userSchema.statics.findByToken = function(token, cb) {
  let user = this;

  // user._id + '' = token
  // token을 decode한다
  jwt.verify(token, 'secretToken', function(err, decoded) {
    // 유저아이디를 이용해서 찾은 다음에 클라이언트에서 가져온 토큰과 디비에 저장된 토큰이 같은지 확인
    
    user.findOne({"_id": decoded, "token": token}, function(err, user) {
      if(err) return cb(err);
      cb(null, user)
    })
  })
}

const User = mongoose.model('User', userSchema);

module.exports = {User};