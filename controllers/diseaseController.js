const mongoose = require('mongoose')
const Disease = mongoose.model('Disease')
const moment = require('moment')
moment.locale('sr')

exports.allDiseases = async (req,res) => {
  const diseaseNumber = await Disease.find().countDocuments()
  const allDiseases = await Disease.find()
  res.render('allDiseases', {
    title:'Sva oboljenja',
    allDiseases,
    diseaseNumber
  })
}

exports.addDisease = (req, res) => {
  res.render('addDisease', {
    title:'Dodaj novo oboljenje'
  })
}

exports.createDisease = async (req, res) => {
  let errors = []
  if(!req.body.name) {
    errors.push({text:'Unesi ime oboljenja'})
  }
  if(!req.body.icd) {
    errors.push({text:'Unesi ICD kod'})
  }
  if(!req.body.description) {
    errors.push({text:'Unesi opis oboljenja'})
  }
  if(errors.length >0 ) {
    res.render('addDisease', {
      title: 'Unesi novo oboljenje',
      errors,
      name:req.body.name,
      icd:req.body.icd,
      description:req.body.description,
      link:req.body.link
    })
  } else {
    const disease = new Disease(req.body)
    try {
      await disease.save()
      req.flash('success_msg','Oboljenje je uspešno kreirano')
      res.redirect('/allDiseases')
    } catch(e) {
      req.flash('error_msg', `Dogodila se greška prilikom upisa novog oboljenja u bazu ${e}`)
      req.redirect('/addDiseases')
    }
  }
}

exports.editDisease = async (req,res) => {
  const disease = await Disease.findOne({_id:req.params.id})
  res.render('addDisease', {
    title:'Izmena podataka o oboljenju',
    disease
  })
}

exports.updateDisease = async (req,res) => {
  req.body.date = Date.now()
  try {
    const disease = await Disease.findOneAndUpdate(
      {_id:req.params.id},
      req.body,
      {
        new:true,
        runValidators:true,
        useFindAndModify:false
      }).exec()
      req.flash('success_msg', 'Uspesno su azurirani podaci o oboljenju')
      res.redirect('/allDiseases')
  } catch(e){
    req.flash('error_msg', `doslo je do greske ${e} prilikom azuriranja podataka o oboljenu`)
    // res.redirect('/allDiseases')
  }
}

exports.getDiseases = async (req,res) => {
  const diseaseList = await Disease.find({name:{"$regex":req.params.diseaseName,"$options":"i"}})
  res.json(diseaseList)
}
