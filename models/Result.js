const mongoose = require('mongoose')

const resultSchema = new mongoose.Schema({
  result:String,
  email:String,
  submitedDate:{
    type:Date,
    default:Date.now
  },
  analyses:[{
    analysis:String,
    value:mongoose.Decimal128,
    analysisId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Analysis'
    },
    outsideOfTheRange:{
      type:Boolean,
      default:false},
    measure:String,
    valueFrom:Number,
    valueTo:Number,
    lessThen:Number,
    greaterThen:Number,
    status:String,
    commentResult:String,
    _id:false
  }],
  commentCube:String,
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
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }
})

module.exports = mongoose.model('Result', resultSchema)
