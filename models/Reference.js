const mongoose = require('mongoose')

const referenceSchema = new mongoose.Schema({
  referenceTitle:{
    type:String,
    required:'Obavezno je uneti naslov reference'
  },
  referenceLink:String
})

module.exports = mongoose.model('Reference', referenceSchema)
