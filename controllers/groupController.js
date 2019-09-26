const mongoose = require('mongoose')
const Group = mongoose.model('Group')
const Faq = mongoose.model('Faq')
const Analysis = mongoose.model('Analysis')
const multer = require('multer')
const path = require('path')
const mime = require('mime-types')

let storage = multer.diskStorage({
  destination:function (req,file,cb) {
    cb(null, 'src/images')
  },
  filename: function (req,file,cb)  {
    const fileExtension = mime.extension(file.mimetype)
    cb(null, `${file.originalname}-${Date.now()}.${fileExtension}`)
  }
})

const upload = multer({storage:storage})

exports.upload = upload.single('iconPath')

// display groups on index page
exports.getGroups = async (req,res) => {
sortByPriority = {priority:-1}
  try {
    const faqFP = await Faq.find({frontPage:true}).sort(sortByPriority)
    const groups = await Group.find({frontPage:true}).sort(sortByPriority)
      res.render('index',{
        title:'labcube - Sve o laboratorijskim analizama',
        faqtitle:'Najčešće postavljana pitanja',
        groups,
        faqFP
      })
  } catch(e) {
    req.flash('error_msg', `Doslo je do greske, pokusajte kasnije ${e}`)
  }
}

// display single group // TODO: create page for single group display
exports.displayGroup = async (req,res) => {
  const group = req.params.name
  const groupDetails = await Group.findOne({name:group})
  const allAnalysis = await Analysis.find({groupId:groupDetails._id},{analysisName:1})
  res.send({group:groupDetails, analyisisdata:allAnalysis})
}

// display form for adding a new group
exports.addGroup = (req,res) => {
  res.render('addGroup', {
    title:'Dodaj novu grupu analiza'
  })
}

// display single group for edit
exports.editGroup = async (req,res) => {
  try{
    const group = await Group.findOne({name:req.params.name})
    res.render('addGroup',{
      title:`${group.name}`,
      group
    })
  } catch(e) {
    req.flash('error_msg', `doslo je do greske ${e}`)
    res.redirect('/addGroup')
  }
}

exports.updateGroup = async (req,res) => {
  if (req.body.frontPage == undefined) {
    req.body.frontPage = false
  }
  if(req.file) {
    req.body.iconPath = req.file.filename
  }
  req.body.lastUpdate = Date.now()
  try {
  const group = await Group.findOneAndUpdate(
    {name:req.params.name},
    req.body,
    {
      new:true,
      runValidators:true,
      useFindAndModify:false
    }).exec()
    req.flash('success_msg', 'Uspesno apdejtovani podaci o grupi')
    res.redirect('/allGroupsList')
  } catch(e) {
    console.log(e)
  }
}

// add a new group to database
exports.createGroup = async (req,res) => {
  let errors = []
  if(!req.body.name) {
    errors.push({text:'Unesite ime grupe'})
  }
  if(!req.body.description) {
    errors.push({text:'Unesite opis grupe'})
  }
  if(errors.length > 0) {
    res.render('addGroup',{
      errors,
      title:'Dodaj novu grupu',
      name:req.body.name,
      description:req.body.description,
      iconPath:req.body.iconPath,
      frontPage:req.body.frontPage,
      priority:req.body.priority
    })
  } else {
    if(req.file) {
      req.body.iconPath = req.file.filename
    } else {
      req.flash('error_msg', 'doslo je do greske prilikom uploada')
    }

    const group = new Group(req.body)
    try {
      await group.save()
      req.flash('success_msg','Grupa analiza je uspešno kreirana')
      res.redirect('/allGroupsList')
      }
    catch (e){
      req.flash('error_msg', `Dogodila se greška prilikom upisa nove grupe u bazu ${e}`)
      res.redirect('/addGroup')
    }
  }
}

// display all groups in backend as a list
exports.listAllGroups = async(req,res) => {
  // const countGroups = await Group.find().count()
  const allGroups = await Group.find().sort({name:1})
    res.render('allGroupsList',{
      title:'Sve grupe analiza',
      allGroups
    })
}

exports.getGroupNames = async (req,res) => {
  const group = await Group.find({name:{ "$regex": req.params.groupName , "$options": "i" }})
  res.json(group)
}

exports.deleteGroup = async (req,res) => {
  const deleteGroup = await Group.findOneAndDelete({_id:req.params.id})
  req.flash('success_msg', 'Grupa je uspesno obrisana.')
  res.json()
}
