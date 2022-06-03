const mongoose = require('mongoose')

const discountSchema = new mongoose.Schema({
  discountId:{
    type:String,
    trim:true
  },
  valid:Boolean,
  discount:Number,
  date:Date,
  ip:String
})


module.exports = mongoose.model('Discount', discountSchema)
