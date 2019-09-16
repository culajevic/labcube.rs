const mongoose = require('mongoose')
const Lab = mongoose.model('Lab')
const moment = require('moment')
moment.locale('sr')
const multer = require('multer')
const path = require('path')
const mime = require('mime-types')

let storage = multer.diskStorage({
  destination:function (req,file,cb) {
    cb(null, 'src/images/lablogo')
  },
  filename: function (req,file,cb)  {
    const fileExtension = mime.extension(file.mimetype);
    cb(null, `${file.originalname}-${Date.now()}.${fileExtension}`)
  }
})

const upload = multer({storage:storage})
exports.upload = upload.single('logo')

exports.addLab = (req,res) => {
  res.render('addLab', {
    title:'Dodaj novu laboratoriju'
  })
}

exports.createLab = async (req,res) => {
  let errors = []
  if(!req.body.labName) {
    errors.push({'text':'Unesi ime laboratorije'})
  }
  if(!req.body.placeId) {
    errors.push({'text':'Odaberi mesto, unesi minimum 3 karaktera da započneš pretragu'})
  }
  if(!req.body.city) {
    errors.push({'text':'Proveri da li je ispravan id mesta'})
  }
  if(!req.body.address) {
    errors.push({'text':'Unesi adresu'})
  }
  if(errors.length>0) {
    res.render('addLab', {
      errors,
      title:'Dodaj novu laboratoriju',
      id:req.body._id,
      labName:req.body.labName,
      slug:req.body.slug,
      placeId:req.body.placeId,
      address:req.body.address,
      city:req.body.city,
      municipality:req.body.municipality,
      postalCode:req.body.postalCode,
      phone:req.body.phone,
      web:req.body.web,
      email:req.body.email,
      vat:req.body.vatNumber,
      priority:req.body.priority,
      locationLAT:req.body.location.coordinates[0],
      locationLNG:req.body.location.coordinates[1],
      mondayOpens:req.body.workingHours.monday.opens,
      mondayCloses:req.body.workingHours.monday.closes,
      tuesdayOpens:req.body.workingHours.tuesday.opens,
      tuesdayCloses:req.body.workingHours.tuesday.closes,
      wednesdayOpens:req.body.workingHours.wednesday.opens,
      wednesdayCloses:req.body.workingHours.wednesday.closes,
      thursdayOpens:req.body.workingHours.thursday.opens,
      thursdayCloses:req.body.workingHours.thursday.closes,
      fridayOpens:req.body.workingHours.friday.opens,
      fridayCloses:req.body.workingHours.friday.closes,
      saturdayOpens:req.body.workingHours.saturday.opens,
      saturdayCloses:req.body.workingHours.saturday.closes,
      sundayOpens:req.body.workingHours.sunday.opens,
      sundayCloses:req.body.workingHours.sunday.closes,
      open24h:req.body.open24h,
      accredited:req.body.accredited,
      disability:req.body.disability,
      patronage:req.body.patronage,
      private:req.body.private,
      description:req.body.description,
      comment:req.body.description

    })
  } else {
    if(req.file) {
      req.body.logo = req.file.filename
    } else {
      req.flash('error_msg', 'doslo je do greske prilikom uploada')
    }
      const lab = new Lab(req.body)
      try {
        await lab.save()
        req.flash('success_msg','Nova laboratorija je uspešno kreirana')
        res.redirect('/allLabs')
        }
      catch (e){
        req.flash('error_msg', `Dogodila se greška ${e}`)
        res.redirect('/addLab')
      }
  }
}

exports.allLabs = async (req,res) => {
  const allLab = await Lab.find({}).populate('placeId').sort({date:-1})
  res.render('allLabs', {
    title:'All labs',
    allLab
  })
}

exports.editLab = async (req,res) => {
  const lab = await Lab.findOne({_id:req.params.id}).populate('placeId')
  res.render('addLab', {
    title:lab.labName,
    lab
  })
  // res.send(lab.labName)
}

exports.updateLab = async (req,res) => {
  if (req.body.open24h == undefined) {
    req.body.open24h = false
  }
  if (req.body.accredited == undefined) {
    req.body.accredited = false
  }
  if (req.body.disability == undefined) {
    req.body.disability = false
  }
  if (req.body.patronage == undefined) {
    req.body.patronage = false
  }
  if (req.body.private == undefined) {
    req.body.private = false
  }

  req.body.date = Date.now()
  if(req.filename) {
    req.body.logo = req.file.filename
  }
  try {
  const lab = await Lab.findOneAndUpdate(
    {_id:req.params.id},
    req.body,
    {
      new:true,
      runValidators:true,
      useFindAndModify:false
    }).exec()
    req.flash('success_msg', 'Uspesno apdejtovani podaci o laboratoriju')
    res.redirect('/allLabs')
  } catch(e) {
    req.flash('error_msg', `doslo je do greske ${e} prilikom azuriranja podataka o laboratoriji`)
  }
}

exports.deleteLab = async (req,res) => {
  const deleteLab = await Lab.findOneAndDelete({_id:req.params.id})
  req.flash('success_msg', 'Laboratorija je uspesno obrisana.')
  res.send('success')
}
