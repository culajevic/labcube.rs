const mongoose = require('mongoose')

const placeSchema = new mongoose.Schema({
  place:String,
  postalCode:Number,
  area:String,
  municipality:String
})

// placeSchema.index({place:'text',municipality:'text'},{weights:{place:5,municipality:1}})

module.exports = mongoose.model('Place', placeSchema)
