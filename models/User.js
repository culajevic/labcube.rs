const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username:String,
  googleId:String,
  email:String,
  admin:Number,
  signupDate:Date,
  password:String,
  isVerified:Boolean,
  emailToken:String
})

module.exports = mongoose.model('User', userSchema)
