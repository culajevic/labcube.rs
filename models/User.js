const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username:String,
  googleId:String,
  email:String,
  admin:Number
})

module.exports = mongoose.model('User', userSchema)
