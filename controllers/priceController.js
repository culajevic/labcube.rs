const mongoose = require('mongoose')
const Price = mongoose.model('Price')
const Place = mongoose.model('Place')
const Lab = mongoose.model('Lab')
const moment = require('moment')
moment.locale('sr')

const authCheck = (req,res, next) => {
  if(!req.user) {
    res.redirect('/prijava')
  } else {
    next()
  }
}

exports.addPrice =  [authCheck, (req,res) => {
  res.render('addPrice',{
    title:'Dodaj cenu'
  })
}]

exports.createPrice = [authCheck, async (req,res) => {

  let errors = []
  let pricelist = []

  if(!req.body.lab) {
    errors.push({'text':'Obavezno je uneti ime laboratorije za koju se unosi cenovnik'})
  }

  for(i=0; i<req.body.cenovnik.analiza.length; i++) {
    // console.log(typeof(req.body.cenovnik.cena[i]))
    //proveriti unetu cenu!!!!
    if(isNaN(req.body.cenovnik.cena[i]) || (req.body.cenovnik.cena[i] == '')) {
      errors.push({'text':'cena je obavezno polje i moguce upisati samo broj, decimale se odvajaju tackom'})
      pricelist.push({'analiza':req.body.cenovnik.analiza[i],
       'ime':req.body.cenovnik.imeanalize[i]})

    } else {
      pricelist.push({'analiza':req.body.cenovnik.analiza[i],
                  'cena':req.body.cenovnik.cena[i],'ime':req.body.cenovnik.imeanalize[i] })
      }
  }

  if(errors.length>0) {
    res.render('addPrice', {
      errors,
      pricelist,
      lab:req.body.lab,
      labName:req.body.labName
    })
  }
    else {

      req.body.cenovnik = pricelist

      // console.log(req.body.cenovnik)
      const price = new Price(req.body)

      try {
        await price.save()
          req.flash('success_msg','Uspesno kreirana cena')
          res.redirect('/addPrice')
        }
        catch (e){
          req.flash('error_msg', `Dogodila se greška prilikom upisa cene u bazu ${e}`)
          res.redirect('/addPrice')
        }
    }// else end
}] // addprice end

exports.editPrice = [authCheck, async (req,res) => {
  const editPrice = await Price.findOne({_id:req.params.id})
  .populate('lab', 'labName')
  .populate('cenovnik.analiza', 'analysisName')
  res.render('addPrice', {
    title:'Pregled cenovnika',
    editPrice
  })
}]

exports.updatePrice = [authCheck, async (req,res) => {

  let errors = []
  let pricelist = []

  req.body.lastUpdated = Date.now()
  for(i=0; i<req.body.cenovnik.analiza.length; i++) {
    //proveriti unetu cenu!!!! formiranje cenovnika
    if(isNaN(req.body.cenovnik.cena[i]) || (req.body.cenovnik.cena[i] == '')) {
      errors.push({'text':'cena je obavezno polje i moguce upisati samo broj, decimale se odvajaju tackom'})
      pricelist.push({'analiza':req.body.cenovnik.analiza[i],
       'ime':req.body.cenovnik.imeanalize[i]})

    } else {
      pricelist.push({'analiza':req.body.cenovnik.analiza[i],
                  'cena':req.body.cenovnik.cena[i],'ime':req.body.cenovnik.imeanalize[i] })
      }
  }
  if(errors.length>0) {
    res.render('addPrice', {
      errors,
      pricelist,
      id:req.params.id,
      lab:req.body.lab,
      labName:req.body.labName
    })
    // res.send(req.body.id)
  } else {

    req.body.cenovnik = pricelist

    // console.log(req.body)
    try {
      const priceUpdate = await Price.findOneAndUpdate(
        {_id:req.params.id},
        req.body,
        {
        new:true,
        runValidators:true,
        useFindAndModify:false
      }).exec()
      req.flash('success_msg', 'Uspesno apdejtovan cenovnik')
      res.redirect('/allPrices')
    }
    catch(e) {
      console.log(e)
    }
  }// else end
}] // updateprice end

exports.allPrices = async (req,res) => {
  const priceListNumber = await Price.find().countDocuments()
  const allPrices = await Price.find({})
  .populate({path:'lab',select:'labName address', populate:{path:'placeId', select:'place'}})
  res.render('allPrices',{
    title:'Svi cenovnici',
    allPrices,
    priceListNumber
  })
}

exports.deletePriceList = [authCheck, async (req,res) => {
  const deletePricelist = await Price.findOneAndDelete({_id:req.params.id})
  req.flash('success_msg', 'Cenovnik je uspesno obrisan.')
  res.json()
}]

exports.getPrices = async (req,res) => {
  let municipality = []
  let labIds = []
  let labIdsObject = []
  let newids = []
  let newObjectArr = []
  newids = req.params.ids.split(',')

  //broj odabrnih analiza
  // console.log(newids.length)

  // numofanalysis = newids.length
   newObjectArr = newids.map(i => mongoose.Types.ObjectId(i))
  //nadji sva mesta koja pripadaju odabranoj opstini
  const getMunicipalityIds = await Place.find({municipality:req.params.grad})
  for(i=0; i<getMunicipalityIds.length; i++) {
    municipality.push(getMunicipalityIds[i]._id)
  }
  //nadji sve laboratorije u mestima koja pripadaju odabranoj opstini
  const getLabs = await Lab.aggregate([
      {$match:{'placeId':{$in:municipality}}}
    ])

  for(i=0; i<getLabs.length; i++) {
    labIds.push(getLabs[i]._id)
  }
// console.log(labIds)
// nadji cene odabranih analiza u laboratorijama na odabranoj opstini
  labIdsObject = labIds.map(item => mongoose.Types.ObjectId(item))

  const getPrices = await Price.aggregate([
    {$match:{'lab':{$in:labIdsObject}}},
    {$unwind:'$cenovnik'},
    {$match:{'cenovnik.analiza':{$in:newObjectArr}}},
    {$group:{_id:'$lab', totalAnalysis:{$sum:1}, total:{$sum:'$cenovnik.cena'}}},
    {$match:{totalAnalysis:{$eq:newids.length}}},
    {$lookup:{from:'labs', localField:'_id', foreignField:'_id', as:'lab'}},
    {$project:{lab:1, total:1, _id:0, totalAnalysis:1}},
    {$lookup:{from:'places', localField:'lab.placeId', foreignField:'_id', as:'labPlace'}},
    {$sort:{total:1}}
  ])
  // res.render('/priceDetails')
  res.json(getPrices)
  // res.render('najboljacena', {test:'test'})
}
