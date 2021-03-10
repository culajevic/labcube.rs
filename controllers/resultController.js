const dotenv = require('dotenv')
const mongoose = require('mongoose')
const moment = require('moment')
const Analysis = mongoose.model('Analysis')
const Price = mongoose.model('Price')
const ObjectId = mongoose.Types.ObjectId
const Result = mongoose.model('Result')
const multer = require('multer')
const mime = require('mime-types')
const nodemailer = require('nodemailer')
moment.locale('sr')



dotenv.config({path:'variables.env'})

//send email with verification code
let transporter = nodemailer.createTransport({
  host:'smtp.gmail.com',
  service:'gmail',
  port:464,
  auth: {
      type: "OAUTH2",
      user: "labcubee@gmail.com",
      clientId: process.env.CLIENTID,
      clientSecret: process.env.CLIENTSECRET,
      refreshToken: process.env.REFRESHTOKEN,
      accessToken:process.env.ACCESSTOKEN
  }
})

//upload results
let storage = multer.diskStorage({
  destination:function (req,file,cb) {
    cb(null, 'src/results')
  },
  filename: function (req,file,cb)  {
    const fileExtension = mime.extension(file.mimetype)
    cb(null, `${file.originalname}-${Date.now()}.${fileExtension}`)
  }
})

const upload = multer({
    storage:storage,
    limits:{fileSize:1024*1024*3,fieldSize: 1024 * 512,fieldNameSize: 200},
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
      }
      else {
        cb(new multer.MulterError('something went wrong, probably Vucic knows what happened'));
      }
    }
  }).single('result')

exports.upload =  (req,res, next) => {
  upload(req, res, (err) => {
    if(err) {
      req.flash('error_msg', 'Dozvoljeni formati fajlova su pdf, jepg, jpg, png i veličina fajla mora biti manja od 3MB')
      res.redirect('/tumacanje-laboratorijskih-analiza')
    } else {
      next()
    }
  })
}

exports.labResult = async (req,res) => {
  let errors = []
  if(!req.body.email) {
    errors.push({text:'Obavezno je uneti email adresu'})
  }
  if(!req.file) {
    errors.push({text:'Niste postavili fajl sa rezultatima'})
  }
  if(errors.length > 0) {
    res.render('labResultsAnalysis', {
      errors,
      package:req.body.package,
      email:req.body.email
    })
  } else {
    if(req.file) {
      req.body.result = req.file.filename
      req.body.date = Date.now()
      req.body.owner = ''
    } else {
      req.flash('error_msg', 'doslo je do greske prilikom uploada')
    }

    const resultUpload = new Result(req.body)
    try {
      await resultUpload.save()
      let mailOptions = {
        from:'labcubee@gmail.com',
        to:'culajevic@gmail.com',
        subject:'lab results',
        text:'',
        html:`${req.body.email} i ${req.body.package}`,
        attachments:[{
          filename:req.file.filename,
          path:req.file.path
        }]

      }
      transporter.sendMail(mailOptions, (error, info) => {
          if(error) {
            return console.log(error)
        } else {
          console.log('message sent', info.messageId)
        }
        })
      req.flash('success_msg','Vaši rezultati su uspešno prosleđeni na tumačenje')
      res.redirect('/')
      }
    catch (e) {
      req.flash('error_msg', `Dogodila se greška prilikom slanja rezultata ${e}`)
      res.redirect('/tumacenje-laboratorijskih-analiza')
    }
  }
}



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

  let title = analysisDetails.analysisName

  const prices = await Price.aggregate([
  {$unwind:'$cenovnik'},
  {$match:{'cenovnik.analiza':ObjectId(analysisDetails._id)}},
  {$group: {_id:'$cenovnik.analiza', minPrice:{$min:'$cenovnik.cena'}, maxPrice:{$max:'$cenovnik.cena'}}},
  {$project:{minPrice:1,
            maxPrice:1}}
])
  res.render('details',{analysisDetails,prices,title, sidebarNav:true, user:req.user})
}

exports.labRestultsAnalysis = (req,res) => {
  res.render('labResultsAnalysis', {user:req.user})
}
