const mongoose = require('mongoose')
const Analysis = mongoose.model('Analysis')
const Place = mongoose.model('Place')
const Group = mongoose.model('Group')
const Message = mongoose.model('Message')
const Discount = mongoose.model('Discount')
const moment = require('moment')
const ObjectId = mongoose.Types.ObjectId
moment.locale('sr')

const authCheck = (req,res, next) => {
  if(!req.user) {
    res.redirect('/prijava')
  } else {
    next()
  }
}

exports.checkDiscount = async (req,res) => {
  let newDate = new Date()
  const discountValue = await Discount.findOne({$and:[{discountId:req.params.id},{valid:true},{dueDate:{$gt:newDate}}]})
  res.json(discountValue)
}
