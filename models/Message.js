const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  message:{
    type:String,
    trim:true
  },
  name:String,
  email:String,
  date:{
    type:Date,
    default:Date.now
  },
  ip:String

})


module.exports = mongoose.model('Message', messageSchema)
