const mongoose = require('mongoose')

const faqSchema = new mongoose.Schema({
  question:{
    type:String,
    trim:true
  },
  answer:{
    type:String,
    trim:true
  },
  priority:Number,
  frontPage:{
    type:Boolean,
    default:false
  }
})


module.exports = mongoose.model('Faq', faqSchema)
