const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,  // 스페이스와 같은 공백을 없애주는 역할
        unique: 1  // 똑같은 이메일을 쓰지 못하도록
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type:String
    },
    tokenExp: {
        type: Number
    }
})

const User = mongoose.model('User', userSchema)
module.exports = {User}