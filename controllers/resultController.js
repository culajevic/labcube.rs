const mongoose = require('mongoose')
const moment = require('moment')
moment.locale('sr')

exports.displayResults = (req,res) => {
  res.render('results')
}
