const mongoose = require('mongoose')

const resultSchema = new mongoose.Schema({
  result:String,
  email:String,
  submitedDate:{
    type:Date,
    default:Date.now
  },
  deadline:{
    type:Date,
    default:Date.now
  },
  package:mongoose.Decimal128,
  status:{
    type:String,
    default:'Pending'
  },
  paid:mongoose.Decimal128,
  ip:String,
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  owner:String
})

module.exports = mongoose.model('Result', resultSchema)
