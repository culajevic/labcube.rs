const mongoose = require('mongoose')
const Analysis = mongoose.model('Analysis')
const Price = mongoose.model('Price')
const moment = require('moment')
const multer = require('multer')
const path = require('path')
const mime = require('mime-types')
moment.locale('sr')


const authCheck = (req,res, next) => {
  if(!req.user) {
    res.redirect('/prijava')
  } else {
    next()
  }
}

let storage = multer.diskStorage({
  destination:function (req,file,cb) {
    cb(null, 'src/images/banners')
  },
  filename: function (req,file,cb)  {
    const fileExtension = mime.extension(file.mimetype)
    cb(null, `${file.originalname}-${Date.now()}.${fileExtension}`)
  }
})

// const upload = multer({storage:storage}).single('banner')
const upload = multer({storage:storage}).fields([{name:'banner'}, {name:'bannerMobile', maxCount:3}])


exports.upload = (req,res, next) => {
  upload(req, res, (err) => {
    if(err) {
      req.flash('error_msg', 'Dozvoljeni formati fajlova su pdf, jepg, jpg, png i veličina fajla mora biti manja od 3MB')
      // res.redirect('/tumacenje-laboratorijskih-analiza')
    } else {
      next()
    }
  })
}


exports.addAnalysis = [authCheck, (req,res) => {
  res.render('addAnalysis', {
    title:'Dodaj novu analizu'
  })
}]

exports.allAnalysis = [authCheck, async (req,res) => {
  const analysisNumber = await Analysis.find().countDocuments()
  const allAnalysis = await Analysis.aggregate([
    {$lookup:{from:'groups', localField:'groupId', foreignField:'_id', as:'group'}},
    {$lookup:{from:'editors', localField:'writtenBy', foreignField:'_id', as:'writtenBy'}},
    {$project:{groupName:'$group.name',
              analysisName:'$analysisName',
              preview:'$preview',
              date:'$date',
              writtenByfirstName:'$writtenBy.firstName',
              writtenBylastName:'$writtenBy.lastName'}},
    {$sort:{groupName:1, analysisName:1}}
  ])
  // const allAnalysis = await Analysis.find({})
  //   .populate('groupId', 'name')
  //   .populate('writtenBy', 'firstName lastName')
  //   .sort({"groupId.name":1})
  res.render('allAnalysis', {
    title:'Sve analize',
    allAnalysis,
    number:analysisNumber
  })

}]



exports.createAnalysis = [authCheck, async (req,res) => {
  if(req.files != undefined) {
    req.body.banner = req.files.banner[0].filename
    req.body.bannerMobile = req.files.bannerMobile[0].filename
  } else {
    req.body.banner = 'greska prilikom uploada'
  }

  if (req.body.active == undefined) {
    req.body.active = false
  }

  let errors = []
  if(!req.body.analysisName) {
    errors.push({text:'Unesi ime analize'})
  }
  if(!req.body.groupId) {
    errors.push({text:'Odaberi grupu kojoj pripada analiza'})
  }

  if(!req.body.writtenBy) {
    errors.push({text:'Odaberi autora teksta'})
  }

  if(errors.length>0) {

  let connectedAnalysis = []
    if(typeof(req.body.connectedTo) !== 'undefined') {
      for(i=0; i<req.body.connectedTo.length; i++) {
        connectedAnalysis.push({'id':req.body.connectedTo[i], 'name':req.body.connectedToName[i]})
      }
    }

    let connectedDisease = []
      if(typeof(req.body.diseasesId) !== 'undefined') {
        for(i=0; i<req.body.diseasesId.length; i++) {
        connectedDisease.push({'id':req.body.diseasesId[i], 'name':req.body.diseaseName[i]})
      }
    }

    let referencesList = []
      if(typeof(req.body.references) !== 'undefined') {
        for(i=0; i<req.body.references.length; i++) {
        referencesList.push({'id':req.body.references[i], 'title':req.body.referenceName[i]})
        }
      }

    let editorList = []
    if(typeof(req.body.writtenBy) !== 'undefined') {
      editorList.push({'id':req.body.writtenBy,
                      'name':req.body.editorHiddenName,
                      'image':req.body.editorHiddenImage})
    }

      res.render('addAnalysis',{
      title:'Dodaj novu analizu',
      errors,
      analysisName:req.body.analysisName,
      groupId:req.body.groupId,
      groupName:req.body.groupName,
      abbr:req.body.abbr,
      alt:req.body.alt,
      preview:req.body.preview,
      shortDesc:req.body.shortDesc,
      description:req.body.description,
      preparation:req.body.preparation,
      examination:req.body.examination,
      low:req.body.low,
      high:req.body.high,
      notes:req.body.notes,
      sample:req.body.sample,
      availableHC:req.body.availableHC,
      connectedAnalysis:connectedAnalysis,
      connectedTo:req.body.connectedTo,
      diseasesId:req.body.diseasesId,
      diseaseName:req.body.diseaseName,
      connectedDisease:connectedDisease,
      references:req.body.references,
      referencesList:referencesList,
      writtenBy:req.body.writtenBy,
      editorList:editorList,
      active:req.body.active
    })
  } else {

      const analysis = new Analysis(req.body)
      try {
        await analysis.save()
        req.flash('success_msg','Analiza je uspešno kreirana')
        res.redirect('/allAnalysis')
        }
      catch (e){
        req.flash('error_msg', `Dogodila se greška prilikom upisa nove analize u bazu${e}`)
        res.redirect('/addAnalysis')
      }
    }
}]

exports.editAnalysis =  [authCheck, async (req,res) => {
  const analysis = await Analysis.findOne({_id:req.params.id})
    .populate('groupId', 'name')
    .populate('diseasesId', 'name _id')
    .populate('references', 'referenceTitle _id')
    .populate('connectedTo', 'analysisName _id')
    .populate('writtenBy', 'firstName lastName picture')
  res.render('addAnalysis', {
    title:'Izmena podataka o analizi',
    analysis
  })
}]

exports.updateAnalysis = [authCheck, async (req,res) => {
  if(req.files.banner) {
    // req.body.banner = req.file.filename
    req.body.banner = req.files.banner[0].filename
  } else if (req.files.bannerMobile) {
    req.body.bannerMobile = req.files.bannerMobile[0].filename
  }
  req.body.date = Date.now()

  if (req.body.availableHC == undefined) {
    req.body.availableHC = false
  }
  if(req.body.connectedTo == undefined) {
    req.body.connectedTo = null
  }
  if(req.body.diseasesID == undefined) {
    req.body.diseasesId = null
  }
  if (req.body.active == undefined) {
    req.body.active = false
  }
  try {
    const analysis = await Analysis.findOneAndUpdate(
      {_id:req.params.id},
      req.body,
      {
        new:true,
        runValidators:true,
        useFindAndModify:false
      }).exec()
      req.flash('success_msg', 'Uspešno su ažurirani podaci o analizi')
      res.redirect('/allAnalysis')
  }
  catch(e){
    req.flash('error_msg', `došlo je do greške ${e} prilikom ažuriranja podataka o analizi`)
  }
}]

exports.getAnalyisisName = async (req,res) => {
  const analysisName = await Analysis.find({analysisName:{"$regex":req.params.analysisName, "$options": "i" }})
  res.json(analysisName)
}

exports.getAnalyisisNameResult = async (req, res) => {
  // it is added filter 'active' so we can hide anaylysis which are not relevant for the users
  const analysisName = await Analysis.find({$or:[{analysisName:{$regex: req.params.analysisName, $options: 'i'}}, {alt:{$regex: req.params.analysisName, $options: 'i'}}, {abbr:{$regex: req.params.analysisName, $options: 'i'}}],active:true})
    .populate('groupId', 'name iconPath').sort({analysisName:1})
  let selectedAnalysis =[]
  let analysisObject = []
  let minPriceArr = []
  let maxPriceArr = []
  for (i=0; i<analysisName.length; i++) {
    selectedAnalysis.push(analysisName[i]._id)
  }
analysisObject = selectedAnalysis.map(item => mongoose.Types.ObjectId(item))


const prices = await Price.aggregate([
  {$unwind:'$cenovnik'},
  {$match:{'cenovnik.analiza':{$in:analysisObject}}},
  {$group: {_id:'$cenovnik.analiza', minPrice:{$min:'$cenovnik.cena'}, maxPrice:{$max:'$cenovnik.cena'}}},
  {$lookup: {from:'analyses', localField:'_id', foreignField:'_id', as:'analiza'}},
  {$lookup: {from:'groups', localField:'analiza.groupId', foreignField:'_id', as:'group'}},
  {$project:{minPrice:1,
            maxPrice:1,
            name:'$analiza.analysisName',
            abbr:'$analiza.abbr',
            alt:'$analiza.alt',
            availableHC:'$analiza.availableHC',
            preview:'$analiza.preview',
            slug:'$analiza.slug',
            groupName:'$group.name',
            iconPath:'$group.iconPath',
            slug:'$analiza.slug'}},
  {$unwind:"$name"},
  {$sort:{name:1}}

])
  res.json({analysisName, prices})
}

exports.deleteAnalysis = [authCheck, async (req,res) => {
  const deleteAnalysis = await Analysis.findOneAndDelete({_id:req.params.id})
  req.flash('success_msg', 'Analiza je uspešno obrisana.')
  res.send()
}]

exports.getAnalysisNameForInterpretation = async (req, res) => {
  // it is added filter 'active' so we can hide anaylysis which are not relevant for the users
  const analysisName = await Analysis.find({$or:[{analysisName:{$regex: req.params.analysisName, $options: 'i'}}, {alt:{$regex: req.params.analysisName, $options: 'i'}}, {abbr:{$regex: req.params.analysisName, $options: 'i'}}]})
    .populate('groupId', 'name iconPath').sort({analysisName:1})
    res.json(analysisName)
  }
