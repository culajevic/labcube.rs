const mongoose = require('mongoose')
const Editor = mongoose.model('Editor')
const moment = require('moment')
moment.locale('sr')
const multer = require('multer')
const path = require('path')
const mime = require('mime-types')

let storage = multer.diskStorage({
  destination:function (req, file, cb) {
    cb(null, 'src/images/editors')
  },
  filename: function (req,file,cb)  {
    const fileExtension = mime.extension(file.mimetype)
    cb(null, `${file.originalname}-${Date.now()}.${fileExtension}`)
  }
})

const upload = multer({storage:storage})
exports.upload = upload.single('picture')

exports.allEditors = async (req,res) => {
  const numOfEditors = await Editor.find().countDocuments()
  const allEditors = await Editor.find()
  res.render('allEditors',{
    title:'Svi urednici',
    numOfEditors,
    allEditors
  })
}

exports.addEditor = (req,res) => {
  res.render('addEditor',{
    title:'Dodaj novog urednika'
  })
}

exports.createEditor = async (req, res) => {
  let errors = []
  if(!req.body.editorTitle) {
    errors.push({'text':'obavezno je uneti titulu urednika'})
  }
  if(!req.body.firstName) {
    errors.push({'text':'obavezno je uneti ime urednika'})
  }
  if(!req.body.lastName) {
    errors.push({'text':'obavezno je uneti prezime urednika'})
  }
  if(errors.length>0) {
    res.render('addEditor',{
      errors,
      title:'Dodaj novog urednika',
      editorTitle:req.body.editorTitle,
      firstName:req.body.firstName,
      lastName:req.body.lastName,
      account:req.body.account,
      email:req.body.email,
      aboutMe:req.body.aboutMe
    })
  } else {
    if(req.file) {
      req.body.picture = req.file.filename
    } else {
      req.flash('error_msg', 'doslo je do greske prilikom uploada')
    }
    const editor = new Editor(req.body)
    try {
      await editor.save()
      req.flash('success_msg', 'novi urednik je uspesno kreiran')
      res.redirect('/allEditors')
    } catch(e) {
      req.flash('error_msg', `Dogodila se greška prilikom upisa novog urednika u bazu ${e}`)
      res.redirect('/addEditor')
    }
  }
}

exports.editEditor = async (req,res) => {
  const editor = await Editor.findOne({_id:req.params.id})
  res.render('addEditor', {
    title:'Izmena podataka o uredniku',
    editor
  })
}

exports.updateEditor = async (req,res) => {
  req.body.date = Date.now()
  if(req.file) {
    req.body.picture = req.file.filename
  }
  let errors = []
  if(!req.body.editorTitle) {
    errors.push({'text':'obavezno je uneti titulu urednika'})
  }
  if(!req.body.firstName) {
    errors.push({'text':'obavezno je uneti ime urednika'})
  }
  if(!req.body.lastName) {
    errors.push({'text':'obavezno je uneti prezime urednika'})
  }
  if(errors.length>0) {
    // req.flash('error_msg','neko od obaveznih polja je obrisano, to nije ok')
    res.redirect('back')
  } else {
    try {
      const editor = await Editor.findOneAndUpdate(
        {_id:req.params.id},
        req.body,
        {
          new:true,
          runValidators:true,
          useFindAndModify:false
        }
      )
      req.flash('success_msg', 'Uspesno apdejtovani podaci o uredniku')
      res.redirect('/allEditors')
    } catch(e) {
      req.flash('error_msg', `doslo je do greske ${e} prilikom azuriranja podataka o uredniku`)
      res.redirect('/allEditors')
    }
  }
}

exports.getEditors = async(req,res) => {
  let editor = await Editor.find({lastName:{"$regex":req.params.lastName, "$options":"i"}})
  res.json(editor)
}

exports.deleteEditor = async (req,res) => {
  const deleteEditor = await Editor.findOneAndDelete({_id:req.params.id})
  req.flash('success_msg', 'urednik uspesno obrisan.')
  res.send()
}
