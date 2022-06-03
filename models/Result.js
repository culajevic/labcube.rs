const mongoose = require('mongoose')

const resultSchema = new mongoose.Schema({
  result:String,
  email:String,
  submitedDate:{
    type:Date,
    default:Date.now
  },
  completedDate:{
    type:Date
  },
  analyses:[{
    analysis:String,
    value:Number,
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
    // status:String,
    commentResult:String,
    _id:false
  }],
  commentCube:String,
  deadline:{
    type:Date,
    default:Date.now
  },
  package:Number,
  status:{
    type:String,
    default:'Pending'
  },
  paid:Number,
  ip:String,
  paymentConsent:Boolean,
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  userFeedback:String,
  userComment:String,
  star:Number,
  feedbackDate:Date,
  readyForInterpreatation:{
    type:Boolean,
    default:false
  }
})

module.exports = mongoose.model('Result', resultSchema)
