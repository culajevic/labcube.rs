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
  package:String,
  status:{
    type:String,
    default:'Pending'
  },
  paid:mongoose.Decimal128,
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  owner:String
})

module.exports = mongoose.model('Result', resultSchema)
