const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
  paymentCode:String,
  paymentDesc:String,
  date:{
    type:Date,
    default:Date.now
  },
  amount:Number,
  ip:String,
  email:String,
  idSuccess:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Results'
  }
})


module.exports = mongoose.model('Payment', paymentSchema)
