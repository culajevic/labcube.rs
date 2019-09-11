const mongoose = require('mongoose')
const Place = mongoose.model('Place')
const Lab = mongoose.model('Lab')

exports.getPlaces = async (req,res) => {
  // partial search
  const address = await Place.find({place:{ "$regex": req.params.place , "$options": "i" }})
  res.json(address)
// full text search
  // const address = await Place.find({$text:{ $search: req.params.place}})

}
