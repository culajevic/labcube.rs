const mongoose = require('mongoose')

const scheduleSchema = new mongoose.Schema({
  lab:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Lab'
    },
  analyses:[{
    _id:false,
    analysis:String,
    analysisId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Analysis'
    },
    value:mongoose.Decimal128,
    outsideOfTheRange:Boolean,
    measure:String,
    valueFrom:mongoose.Decimal128,
    valueTo:mongoose.Decimal128,
    lessThen:mongoose.Decimal128,
    greaterThen:mongoose.Decimal128,
    status:String,
    comment:String,
    commentResult:String
  }],
  createdDate:{
    type:Date,
    default:Date.now
  },
  scheduledFor:Date,
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  uzimanjeUzorka:String,
  total:Number,
  labCubePrice:Number,
  status:String,
  commentLab:String,
  commentCube:String,
  feedback:Boolean,
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }
})

module.exports = mongoose.model('Schedule', scheduleSchema)
