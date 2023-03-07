const mongoose = require('mongoose')
const Price = mongoose.model('Price')
const Place = mongoose.model('Place')
const Lab = mongoose.model('Lab')
const Group = mongoose.model('Group')
const Users = mongoose.model('User')
const Analysis = mongoose.model('Analysis')
const moment = require('moment')
const ObjectId = mongoose.Types.ObjectId
moment.locale('sr')

const authCheck = (req,res, next) => {
  if(!req.user) {
    res.render('signin', {title:'LabCube | Prijavite se'})
  } else {
    next()
  }
}

exports.priceMissing = async (req,res) => {
  let allAnalysis = []
  let allLabs = []
  let allLabsWithPrice = []

      //koliko ima cenovnika za koju analizu trenutno proverava koliko labova radi krvnu sliku
      // let countPrices = await Price.aggregate([
      //   {$unwind:'$cenovnik'},
      //   {$match:{'cenovnik.analiza':ObjectId('604f3c54e18c77e5fcc4f456')}},
      //   {$group:{_id:'$cenovnik.analiza', count:{$sum:1}}},
      //   {$project:{lab:1, count:1}},
      //   {$sort:{count:1}}
      // ])

      //cena koja nedostaje
     //  let missingPrice = await Price.aggregate([
     //    {$unwind:'$cenovnik'},
     //    {$match:{'cenovnik.analiza':ObjectId('60a590eece662102d09595bf')}},
     //    {$group:{_id:'$_id'}},
     //    {$project:{lab:1}}
     //  ])
     // res.send({missingPrice})

    //prikaz svih cena
     // let missingPrice = await Price.aggregate([
     //    {$unwind:'$cenovnik'},
     //    {$group:{_id:'$cenovnik.analiza'}},
     //    {$project:{lab:1}}
     //  ])
     //  res.send(missingPrice)
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

  let displayMissingPricesLab = await Lab.find({_id:{$in:result}},{labName:1, address:1, place:1, date:1}).populate('placeId','place').sort({date:-1})
  let numofItems = displayMissingPricesLab.length
  res.render('withoutpricelist', {displayMissingPricesLab, title:'Laboratorije koje nemaju cenovnik', number:numofItems})
  // res.send(countPrices)
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

    let displayMissingPrices = await Analysis.find({_id:{$in:result}}, {analysisName:1, slug:1, date:1}).populate('groupId', 'name').sort({date:-1})
    let number = displayMissingPrices.length
    res.render('analysiswithoutprice',{displayMissingPrices, title:'Analize koje nemaju cenu', number})

}

exports.getAllUsers = [authCheck, async (req,res) => {
  let allUsers = await Users.find({}).sort({signupDate:-1})
  let number = allUsers.length
  res.render('allUsers', {allUsers, title:'Korisnici', number})
}]

exports.priceAnalysis = async (req,res) => {
  // koliko ima cenovnika za koju analizu trenutno proverava koliko labova radi krvnu sliku
  let countPrices = await Price.aggregate([
    {$unwind:'$cenovnik'},
    // {$match:{'cenovnik.analiza':ObjectId('604f3c54e18c77e5fcc4f456')}},
    {$lookup:{from:'analyses', localField:'cenovnik.analiza', foreignField:'_id', as:'analiza'}},
    // {$group:{_id:'$cenovnik.analiza', count:{$sum:1}}},
    {$group:{_id:'$analiza.analysisName', count:{$sum:1}}},
    {$project:{count:1,'analiza.analysisName':1}},
    {$sort:{count:1}}
  ])
  res.render('priceAnalysis', {title:'Analiza cena', countPrices})
}

exports.minMaxPrice = async (req,res) => {
  // let minPrice = []
  // let maxPrice = []

  let minMaxPrice = await Price.aggregate([
    {$lookup:{from:'labs', localField:'lab', foreignField:'_id', as:'lab'}},
    {$unwind:'$cenovnik'},
    // {$match:{'cenovnik.analiza':ObjectId('604f3c54e18c77e5fcc4f456')}},
    {$lookup:{from:'analyses', localField:'cenovnik.analiza', foreignField:'_id', as:'analiza'}},
    {$group: {
      _id:{"analiza":"$analiza.analysisName", "id":"$analiza._id"},
      minPrice:{$min:'$cenovnik.cena'},
      maxPrice:{$max:'$cenovnik.cena'}}},
    {$sort:{_id:1}}

  ])
  // for (let i = 0; i< minMaxPrice.length; i++) {
  //   minPrice.push({'analiza':minMaxPrice[i]._id.analiza, 'lab':minMaxPrice[i]._id.lab, 'minPrice':minMaxPrice[i].minPrice})
  //   maxPrice.push({'analiza':minMaxPrice[i]._id.analiza, 'lab':minMaxPrice[i]._id.lab, 'maxPrice':minMaxPrice[i].maxPrice})
  // }

  //finding lab with min and max price
  // let min = minPrice.reduce((prev, curr) => (prev.minPrice < curr.minPrice) ? prev : curr);
  // let max = maxPrice.reduce((prev, curr) => (prev.maxPrice > curr.maxPrice) ? prev : curr);
  //
  // console.log(min)
  // console.log(max)
  res.render('minMaxPrice', {title:'Mix i Max cena analize', minMaxPrice})
  // res.send(minMaxPrice)

}

exports.findMinAndMaxPriceLab =  async (req,res) => {
  let minPrice = []
  let maxPrice = []

  let minMaxPrice = await Price.aggregate([
    {$lookup:{from:'labs', localField:'lab', foreignField:'_id', as:'lab'}},
    {$unwind:'$cenovnik'},
    {$match:{'cenovnik.analiza':ObjectId(req.params.id)}},
    {$lookup:{from:'analyses', localField:'cenovnik.analiza', foreignField:'_id', as:'analiza'}},
    {$group: {
      _id:{"analiza":"$analiza.analysisName", "lab":"$lab.labName"},
      minPrice:{$min:'$cenovnik.cena'},
      maxPrice:{$max:'$cenovnik.cena'}}},
    {$sort:{_id:1}}

  ])
  for (let i = 0; i< minMaxPrice.length; i++) {
    minPrice.push({'analiza':minMaxPrice[i]._id.analiza, 'lab':minMaxPrice[i]._id.lab, 'minPrice':minMaxPrice[i].minPrice})
    maxPrice.push({'analiza':minMaxPrice[i]._id.analiza, 'lab':minMaxPrice[i]._id.lab, 'maxPrice':minMaxPrice[i].maxPrice})
  }

  //finding lab with min and max price
  let min = minPrice.reduce((prev, curr) => (prev.minPrice < curr.minPrice) ? prev : curr);
  let max = maxPrice.reduce((prev, curr) => (prev.maxPrice > curr.maxPrice) ? prev : curr);

  // res.render('minMaxPrice', {title:'Mix i Max cena analize', minMaxPrice})
  res.render('labwithMinMaxPrice', {title:'Min i Max cena po analizi po laboratoriji', min, max})
}
