const mongoose = require('mongoose')

const resultSchema = new mongoose.Schema({
  result:String,
  email:String,
  date:{
    type:Date,
    default:Date.now()
  },
  package:String,
  status:{
    type:String,
    default:'Pending'
  },
  owner:String
})

module.exports = mongoose.model('Result', resultSchema)
