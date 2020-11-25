const mongoose = require('mongoose')

const scheduleSchema = new mongoose.Schema({
  lab:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Lab'
    },
  analiza:[String],
  createdDate:{
    type:Date,
    default:Date.now()
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  total:Number,
  status:String
})

module.exports = mongoose.model('Schedule', scheduleSchema)
