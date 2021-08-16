const express = require('express')
const app = express()
const port = 5000
const bodyparser = require('body-parser');
const {User} = require('./models/User');
const config = require('./config/key');

// bodyarser가 서버에서 오는 정보를 분석해서 가져오도록 
// application/x-www-form-urlencoded 데이터를 분석해서 가져옴
app.use(bodyparser.urlencoded({extends: true})); 
// application/json 데이터를 분석해서 가져옴
app.use(bodyparser.json());

const mongoose = require('mongoose')  // mongoDB 사용
mongoose.connect(config.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World! 안녕하세요'))

app.post('/register', (req, res) => {
    // 회원 가입 할 때 필요한 정보들을 client에서 가져오면 
    // 그것들을 데이터베이스에 넣어준다.
    const user = new User(req.body)
    // 정보 저장, 에러 시 json 형식으로 전달
    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success: true
        })
    })

    /* postman에 밑처럼 정보 입력 시 맞으면 success: true 출력
        {
        "name": "GaGa123",
        "email": "GaGa123@naver.com",
        "password": "1234567"
        } 
    */   
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

