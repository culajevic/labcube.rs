const mongoose = require('mongoose')
// mongoose.Promise = global.Promise
const slug = require('slugs')

const diseaseSchema = new mongoose.Schema({
  icd:String,
  name:{
    type:String,
    trim:true
  },
  description:{
    type:String,
    trim:true
  },
  link:{
    type:String,
    trim:true
  },
  date:{
    type:Date,
    default:Date.now
  }
})

module.exports = mongoose.model('Disease', diseaseSchema)
