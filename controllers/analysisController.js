const mongoose = require('mongoose')
const Analysis = mongoose.model('Analysis')
const Price = mongoose.model('Price')
const moment = require('moment')
moment.locale('sr')

exports.addAnalysis = (req,res) => {
  res.render('addAnalysis', {
    title:'Dodaj novu analizu'
  })
}

exports.allAnalysis = async (req,res) => {
  const analysisNumber = await Analysis.find().countDocuments()
  const allAnalysis = await Analysis.find({}).sort({analysisName:1})
    .populate('groupId', 'name')
    .populate('writtenBy', 'firstName lastName')
  res.render('allAnalysis', {
    title:'All analysis',
    allAnalysis,
    analysisNumber
  })
}

exports.createAnalysis = async (req,res) => {
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
      notes:req.body.sample,
      availableHC:req.body.availableHC,
      connectedAnalysis:connectedAnalysis,
      connectedTo:req.body.connectedTo,
      diseasesId:req.body.diseasesId,
      diseaseName:req.body.diseaseName,
      connectedDisease:connectedDisease,
      references:req.body.references,
      referencesList:referencesList,
      writtenBy:req.body.writtenBy,
      editorList:editorList
    })
  } else {
    console.log(req.body.description)
      const analysis = new Analysis(req.body)
      try {
        await analysis.save()
        req.flash('success_msg','Analiza je uspešno kreirana')
        res.redirect('/')
        }
      catch (e){
        req.flash('error_msg', `Dogodila se greška prilikom upisa nove analize u bazu${e}`)
        res.redirect('/addAnalysis')
      }
    }
}

exports.editAnalysis =  async (req,res) => {
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
  // res.json(analysis)
}

exports.updateAnalysis = async (req,res) => {
  req.body.date = Date.now()
  if (req.body.availableHC == undefined) {
    req.body.availableHC = false
  }
  // if(typeof(req.body.writtenBy) == 'undefined') {
  //   req.flash('error_msg', 'Obavezno je uneti podatke o autoru')
  // }
  try {
    const analysis = await Analysis.findOneAndUpdate(
      {_id:req.params.id},
      req.body,
      {
        new:true,
        runValidators:true,
        useFindAndModify:false
      }).exec()
      req.flash('success_msg', 'Uspesno su azurirani podaci o analizi')
      res.redirect('/allAnalysis')
  }
  catch(e){
    req.flash('error_msg', `doslo je do greske ${e} prilikom azuriranja podataka o analizi`)
  }
}
exports.getAnalyisisName = async (req,res) => {
  const analysisName = await Analysis.find({analysisName:{"$regex":req.params.analysisName, "$options": "i" }})
  res.json(analysisName)

}

exports.getAnalyisisNameResult = async (req, res) => {
  // const analysisName = await Analysis.find({analysisName:{"$regex":req.params.analysisName, "$options": "i" }})
  // .populate('groupId', 'name iconPath')
  const analysisName = await Analysis.find({$or:[{analysisName:{$regex: req.params.analysisName, $options: 'i'}},{alt:{$regex: req.params.analysisName, $options: 'i'}}]})
    .populate('groupId', 'name iconPath')

  let minPriceArr = []
  let maxPriceArr = []

    for(i=0; i<analysisName.length; i++) {
      let minPrice = await Price.find({'cenovnik.analiza':analysisName[i]._id},{cena:1,'cenovnik.$':1})
      .sort({"cenovnik.cena":1})
      .limit(1)
      minPriceArr.push(minPrice)

      let maxPrice = await Price.find({'cenovnik.analiza':analysisName[i]._id},{cena:1,'cenovnik.$':1})
      .sort({"cenovnik.cena":-1})
      .limit(1)
      maxPriceArr.push(maxPrice)
  }

  // res.render(analysisName)
res.json({analysisName, minPriceArr, maxPriceArr})
  // res.json({analysisName, minPriceArr, maxPriceArr})
}

exports.deleteAnalysis = async (req,res) => {
  const deleteAnalysis = await Analysis.findOneAndDelete({_id:req.params.id})
  req.flash('success_msg', 'Analiza je uspesno obrisana.')
  res.send()
}
