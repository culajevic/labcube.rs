const mongoose = require('mongoose')
const moment = require('moment')
const Analysis = mongoose.model('Analysis')
const Price = mongoose.model('Price')
moment.locale('sr')

exports.displayResults = (req,res) => {
  res.render('results')
}

exports.displayAnalysisDetails = async (req,res) => {
  let analysisDetails = await Analysis.findOne({slug:req.params.slug})
  .populate('connectedTo', 'analysisName slug')
  .populate('references')

  let minPrice = await Price.findOne({'cenovnik.analiza':analysisDetails._id},{cena:1,'cenovnik.$':1})
  .sort({'cenovnik.cena':1})

  let maxPrice = await Price.findOne({'cenovnik.analiza':analysisDetails._id},{cena:1,'cenovnik.$':1})
  .sort({'cenovnik.cena':-1})


  res.render('details',{analysisDetails,minPrice,maxPrice})
  // res.send({analysisDetails, minPrice, maxPrice})

}
