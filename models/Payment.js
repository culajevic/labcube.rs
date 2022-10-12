const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
  paymentCode:String,
  paymentDesc:String,
  date:{
    type:Date,
    default:Date.now
  },
  amount:Number,
  cardHolder:String,
  address:String,
  postalCode:String,
  city:String,
  ip:String,
  email:String,
  authCode:String,
  idSuccess:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Results'
  }
})


module.exports = mongoose.model('Payment', paymentSchema)
