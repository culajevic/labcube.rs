const mongoose = require('mongoose')
const Analysis = mongoose.model('Analysis')
const Price = mongoose.model('Price')
const moment = require('moment')
moment.locale('sr')


exports.aboutus = (req,res) => {
  res.render('aboutUs',{
    title:'O nama'
  })
}

exports.privacy = (req,res) => {
  res.render('privacy',{
    title:'Politika privatnosti'
  })
}

exports.terms = (req,res) => {
  res.render('terms',{
    title:'Uslovi korišćenja'
  })
}
