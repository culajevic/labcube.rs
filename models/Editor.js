const mongoose = require('mongoose')

const editorSchema = new mongoose.Schema({
  firstName:{
    type:String,
    trim:true
  },
  lastName:{
    type:String,
    trim:true,
  },
  editorTitle:{
    type:String,
    trim:true
  },
  accountName:String,
  email:String,
  picture:String,
  aboutMe:String,
  date:{
    type:Date,
    default:Date.now
  }
})

module.exports = mongoose.model('Editor', editorSchema)
