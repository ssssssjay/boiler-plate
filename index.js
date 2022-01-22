// 익스프레스 사용을 위한
const express = require('express');
const app = express();
const port = 8080;

// 몽고디비를 편하게 쓰게해주는 몽구스! 설치필요
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://sungjae:1234@cluster0.qveyb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {

}).then(() => console.log('mongoDB Connected!'))
  .catch(err => console.log(err));



app.get('/', (req, res, next) => {res.send('hello world!!!!!!')});

app.listen(port, () => console.log(`${port} listen`));