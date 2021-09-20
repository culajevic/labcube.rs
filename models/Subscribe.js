const mongoose = require('mongoose')

const subscribeSchema = new mongoose.Schema({
  email:String,
  date:{
    type:Date,
    default:Date.now
  },
  status:{
    type:String,
    default:'Subscribed'
  } 
})


module.exports = mongoose.model('Subscribe', subscribeSchema)
