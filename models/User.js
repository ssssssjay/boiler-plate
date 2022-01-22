const mongoose = require('mongoose');

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

const User = mongoose.model('User', userSchema);

module.exports = {User};