const mongoose = require('mongoose')
const moment = require('moment')
const Analysis = mongoose.model('Analysis')
const Price = mongoose.model('Price')
const ObjectId = mongoose.Types.ObjectId
moment.locale('sr')

exports.displayResults = (req,res) => {
  res.render('results',{
    sidebarNav:false
  })
}

exports.displayAnalysisDetails = async (req,res) => {
  let analysisDetails = await Analysis.findOne({slug:req.params.slug})
  .populate('connectedTo', 'analysisName slug')
  .populate('references')
  .populate('groupId', 'iconPath')


const prices = await Price.aggregate([
  {$unwind:'$cenovnik'},
  {$match:{'cenovnik.analiza':ObjectId(analysisDetails._id)}},
  {$group: {_id:'$cenovnik.analiza', minPrice:{$min:'$cenovnik.cena'}, maxPrice:{$max:'$cenovnik.cena'}}},
  {$project:{minPrice:1,
            maxPrice:1}}
])

  // let minPrice = await Price.findOne({'cenovnik.analiza':analysisDetails._id},{'cenovnik.$':1})
  // .sort({'cenovnik.cena':1})
  //
  // let maxPrice = await Price.findOne({'cenovnik.analiza':analysisDetails._id},{'cenovnik.$':1})
  // .sort({'cenovnik.cena':-1})
  // console.log(prices)

  // res.render('details',{analysisDetails,minPrice,maxPrice,sidebarNav:true})
  res.render('details',{analysisDetails,prices,sidebarNav:true})
  // res.send({analysisDetails, minPrice, maxPrice})

}
