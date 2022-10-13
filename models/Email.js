const mongoose = require('mongoose')

const getUserEmail = new mongoose.Schema({
  question:{
    type:String,
    trim:true
  },
  email:{
    type:String,
    trim:true
  },
  date:{
    type:Date,
    default:Date.now
  },
  accountCreated:{
    type:Boolean,
    default:false
  },
  ip:String
})

module.exports = mongoose.model('getUserEmail', getUserEmail)
