const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
// Salt를 이용해서 비밀번호를 암호화 해야 해요
// 그럴려면 salt를 먼저 생성해야함
// saltRounds는 salt가 몇글자인지를 말하는거임

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
  }
})

const User = mongoose.model('User', userSchema);

module.exports = {User};