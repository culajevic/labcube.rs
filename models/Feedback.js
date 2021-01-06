const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
  lab:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Lab'
    },
    hospitality:Number,
    venipuncture:Number,
    speed:Number,
    covid:Number,
    comment:String,
    createdDate:{
    type:Date,
    default:Date.now
    },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }
})

module.exports = mongoose.model('Feedback', feedbackSchema)
