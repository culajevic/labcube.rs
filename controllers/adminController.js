const mongoose = require('mongoose')
const Price = mongoose.model('Price')
const Place = mongoose.model('Place')
const Lab = mongoose.model('Lab')
const Group = mongoose.model('Group')
const Analysis = mongoose.model('Analysis')
const moment = require('moment')
const ObjectId = mongoose.Types.ObjectId
moment.locale('sr')


exports.priceMissing = async (req,res) => {
  let allAnalysis = []
  let allLabs = []
  let allLabsWithPrice = []

      //koliko ima cenovnika za koju analizu
      // let missingPrice = await Price.aggregate([
      //   {$unwind:'$cenovnik'},
      //   {$group:{_id:'$cenovnik.analiza', count:{$sum:1}}},
      //   {$project:{lab:1, count:1}},
      //   {$sort:{count:1}}
      // ])

      //cena koja nedostaje
     //  let missingPrice = await Price.aggregate([
     //    {$unwind:'$cenovnik'},
     //    {$match:{'cenovnik.analiza':ObjectId('605bac8574bade708ae87dcf')}},
     //    {$group:{_id:'$_id'}},
     //    {$project:{lab:1}}
     //  ])
     // res.send(missingPrice)

    //prikaz svih cena
     // let missingPrice = await Price.aggregate([
     //    {$unwind:'$cenovnik'},
     //    {$group:{_id:'$cenovnik.analiza'}},
     //    {$project:{lab:1}}
     //  ])
// let allLabsNewArr = ['605d21de60ff5a1535d21958', '605d21de60ff5a1535d21959']
// let allLabsWithPriceNewArr = ['605d21de60ff5a1535d21a67','605d21de60ff5a1535d21959']

 let getallLabs = await Lab.find({})
  for (let i = 0; i<getallLabs.length; i++) {
    allLabs.push(getallLabs[i]._id.toString())
  }


 let missingPrice = await Price.aggregate([
    {$unwind:'$cenovnik'},
    {$group:{_id:'$lab'}},
    {$project:{lab:1}}
  ])

  for (let i = 0; i<missingPrice.length; i++) {
    allLabsWithPrice.push(missingPrice[i]._id.toString())
  }

  let result = allLabs.filter(item => !allLabsWithPrice.includes(item))

  let displayMissingPricesLab = await Lab.find({_id:{$in:result}},{labName:1, address:1, place:1}).populate('placeId','place').sort({labName:1})
  let numofItems = displayMissingPricesLab.length
  res.render('withoutpricelist', {displayMissingPricesLab, title:'Laboratorije koje nemaju cenovnik', number:numofItems})
}

exports.analysispriceMissing = async (req,res) => {
  let allAnalysisArr = []
  let missingPriceArr = []

  let allAnalysis = await Analysis.find({})
    for (let i = 0; i<allAnalysis.length; i++){
      allAnalysisArr.push(allAnalysis[i]._id.toString())
    }

    let missingPrice = await Price.aggregate([
       {$unwind:'$cenovnik'},
       {$group:{_id:'$cenovnik.analiza'}}
     ])

     for (let i = 0; i<missingPrice.length; i++) {
       missingPriceArr.push(missingPrice[i]._id.toString())
     }

    let result = allAnalysisArr.filter(item => !missingPriceArr.includes(item))

    let displayMissingPrices = await Analysis.find({_id:{$in:result}}, {analysisName:1, slug:1}).populate('groupId', 'name')
    let number = displayMissingPrices.length
    res.render('analysiswithoutprice',{displayMissingPrices, title:'Analize koje nemaju cenu', number})

}