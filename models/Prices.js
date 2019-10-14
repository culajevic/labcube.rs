const mongoose = require('mongoose')

const priceSchema = new mongoose.Schema({
  lab:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Lab'
    },
  cenovnik:[{
    _id: false,
    analiza:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Analysis'
      },
    cena:Number
  }],
  lastUpdated:{
    type:Date,
    default:Date.now()
  },
  comment:String
})

module.exports = mongoose.model('Price', priceSchema)
