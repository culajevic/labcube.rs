const mongoose = require('mongoose')
const Analysis = mongoose.model('Analysis')
const Price = mongoose.model('Price')
const Group = mongoose.model('Group')
const moment = require('moment')
moment.locale('sr')


exports.aboutus = async (req,res) => {
  const groupNames = await Group.find({},{name:1,slug:1,_id:0}).sort({name:1})
  res.render('aboutus',{
    title:'O nama',
    groupNames,
    user:req.user
  })
}

exports.privacy = async (req,res) => {
  const groupNames = await Group.find({},{name:1,slug:1,_id:0}).sort({name:1})
  res.render('privacy',{
    title:'Politika privatnosti',
    groupNames,
    user:req.user
  })
}

exports.terms = async (req,res) => {
const groupNames = await Group.find({},{name:1,slug:1,_id:0}).sort({name:1})
  res.render('terms',{
    title:'Uslovi korišćenja',
    groupNames,
    user:req.user
  })
}

exports.paymentDetails = async (req,res) => {
const groupNames = await Group.find({},{name:1,slug:1,_id:0}).sort({name:1})
  res.render('paymentDetails',{
    title:'Uslovi plaćanja',
    groupNames,
    user:req.user
  })
}
