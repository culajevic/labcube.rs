const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const dotenv = require('dotenv')
const passport = require('passport')
const validator = require("email-validator")
const bcrypt = require('bcrypt')
const User = mongoose.model('User')
const Schedule = mongoose.model('Schedule')
const Lab = mongoose.model('Lab')
const Place = mongoose.model('Place')
const Feedback = mongoose.model('Feedback')
const Result = mongoose.model('Result')
const Group = mongoose.model('Group')
const nodemailer = require('nodemailer')
const moment = require('moment')
const crypto = require('crypto')
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

exports.signin = (req,res) => {
  res.render('signin',{title:'Labcube - Prijava'})
}

exports.login = (req,res,next) => {
  passport.authenticate('local', {
    successRedirect:'/profile',
    // successRedirect:'/',
    failureRedirect:'/prijava',
    failureFlash:true
  })(req,res,next)
}

exports.logout = (req, res) => {
  res.send('logout')
}

//start with google
exports.google =  passport.authenticate('google',{scope:['openid', 'email', 'profile']})

exports.redirect = [passport.authenticate('google'),
  (req,res) => {res.redirect('/profile')}]

const authCheck = (req,res, next) => {
  if(!req.user) {
    res.redirect('/prijava')
  } else {
    next()
  }
}

exports.profile = [authCheck, async (req,res) => {
  //if user is lab redirect it to lab page
  const lastLoginDate = await User.findOneAndUpdate(
    {email:req.user.email},
    {lastLoginDate:Date.now()},
    {new:true,
    useFindAndModify:false}).exec()

  if(req.user.lab == 1 ) {

    const findLab = await Lab.findOne({_id:req.user.labId})

    const findFeedback = await Feedback.find({lab:req.user.labId})
    let hospitality = 0
    let venipuncture = 0
    let speed = 0
    let covid = 0
    let overall = 0
    for (let i = 0; i<findFeedback.length; i++){
      hospitality += ((findFeedback[i].hospitality) / findFeedback.length)
      venipuncture += ((findFeedback[i].venipuncture) / findFeedback.length)
      speed += ((findFeedback[i].speed) / findFeedback.length)
      covid += ((findFeedback[i].covid) / findFeedback.length)
    }
  hospitality = hospitality.toFixed(1)
  venipuncture = venipuncture.toFixed(1)
  speed = speed.toFixed(1)
  covid = covid.toFixed(1)
  overall = ((parseFloat(hospitality) + parseFloat(venipuncture) + parseFloat(speed) + parseFloat(covid))/4).toFixed(1)


    //total number of records
    const countTotal = await Schedule.countDocuments({lab:req.user.labId})

    const page = req.params.page || 1
    const limit = 4
    const pages = Math.ceil(countTotal / limit)
    const skip = (page * limit) - limit


    const findScheduledAnalysis = await Schedule
      .find({lab:req.user.labId})
      .skip(skip)
      .limit(limit)
      .populate('user')
      .sort({createdDate:-1})
    if(!findScheduledAnalysis.length && skip) {
      req.flash('error_msg', 'ne postoji ova strana')
      res.redirect('/profile/page/'+pages)
      return
    }
    res.render('labDashboard', {findLab, findScheduledAnalysis, page, countTotal, pages, hospitality, speed, covid, venipuncture,overall})
  } //if regular user
    else if(req.user.admin == 0) {
    const myAppointments = await Schedule.find({user:req.user.id})
    .populate('lab')
    .sort({createdDate:-1})
    let cities = await Place.distinct("municipality")
    const numOfMyAnalysis = myAppointments.length
    const groupNames = await Group.find({},{name:1,slug:1,_id:0}).sort({name:1})
    const myOtherResults = await Result.find({userId:req.user.id}).sort({submitedDate:-1})
    const numOfMyOtherResults = myOtherResults.length

    res.render('profile',{
      user:req.user,
      cities:cities,
      myAppointments:myAppointments,
      numOfMyAnalysis:numOfMyAnalysis,
      myOtherResults:myOtherResults,
      numOfMyOtherResults,
      groupNames
    })

    // res.send(`<a href=/logout>log out</a> ${req.user.username}`)
  }

  else {
    res.redirect('/admindashboard')
  }
}]

exports.registerForm = (req,res) => {
  res.render('register',{title:'Labcube - Kreirajte nalog'})
}

exports.admindasboard =  [authCheck, (req,res) => {
  let errors = []
  if(req.user.admin == 1) {
    res.render('admindashboard', {title:'Admin panel'})
  } else if(req.user.lab == 1) {
    res.send('ne moze')
  } else {
    errors.push({text:'Nice try'})
    res.render('signin',{errors})

  }
}]

exports.register =  async (req,res) => {
  let errors = []
  let {email,password, privacy, conditions} = req.body
  if(!privacy || !conditions) {
    errors.push({text:'Neophodno je da potvrdite da ste pročitali i razumeli uslove korišćenja i politiku privatnosti'})
  }
  if(!validator.validate(email)) {
    errors.push({text:'Email adresa nije ispravna'})
  }
  if (password.length<6) {
    errors.push({text:'Lozinka mora imati više od 6 karaktera'})
  }
  if (errors.length>0) {
    res.render('register',{errors})
  } else {
    let findUser = await User.findOne({email:email})
      if(findUser) {
        errors.push({text:'Već postoji nalog koji koristi ovaj email'})
        res.render('register',{errors, title:'Labcube - Kreirajte labcube nalog'})
      } else {

        const newUser = new User({
          username:email,
          email:email,
          conditions:true,
          privacy:true,
          signupDate:Date.now(),
          isVerified:false,
          admin:0,
          lab:0,
          emailToken:'',
          password:password
        })

        try {
          let random = async () => {
            let secretNumber = Math.floor(Math.random() * 100000)
            return secretNumber
          }
          newUser.emailToken = await random()
          const output = `Your verification code is ${newUser.emailToken}`


          let mailOptions = {
            from:'labcubee@gmail.com',
            to:newUser.email,
            subject:'Verify you labcube account',
            text:'',
            html:output
          }

           bcrypt.genSalt(10, (err,salt) => {
            bcrypt.hash(newUser.password, salt, (err,hash) => {
              if(err) throw err
              newUser.password = hash
              newUser.save()

            })
          })
          transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
              return console.log(error)
          } else {
            console.log('message sent', info.messageId)
          }
          })
          req.flash('success_msg','Poslali smo vam mejl sa linkom za aktivaciju naloga')
          res.redirect('/verify')
          }
        catch (e){
          req.flash('error_msg', `Dogodila se greška prilikom registracija ${e}`)
          res.redirect('/register')
        }
      }
  }
}

exports.findUserEmail =  async (req,res) => {
  if(req.params.userEmail) {
  let userIdArr = []
  let newObjectArr = []
  const findUserEmail = await User.find({email:{$regex: req.params.userEmail, $options: 'i'}})

  for(let i=0; i<findUserEmail.length; i++) {
   userIdArr.push(findUserEmail[i]._id)
   newObjectArr = userIdArr.map(i => mongoose.Types.ObjectId(i))
  }

  const findMyLabUsers  = await Schedule
      .find({lab:req.user.labId, user: { $in: newObjectArr}})
      .populate('user')
      .sort({createdDate:-1})
      res.json(findMyLabUsers)
} else {

  let myLabScheduledAnalysis = await Schedule.find({lab:req.user.labId}).populate('user').sort({createdDate:-1})
  res.json(myLabScheduledAnalysis)
  // res.json({myLabScheduledAnalysis, page})
  // res.render('index')
  }
}

exports.findUserEmailByLabCube =  async (req,res) => {
  if(req.params.userEmail) {
  let userIdArr = []
  let newObjectArr = []
  const findUserEmail = await User.find({email:{$regex: req.params.userEmail, $options: 'i'}})

  for(let i=0; i<findUserEmail.length; i++) {
   userIdArr.push(findUserEmail[i]._id)
   newObjectArr = userIdArr.map(i => mongoose.Types.ObjectId(i))
  }

  const findMyLabUsers  = await Schedule
      .find({user: { $in: newObjectArr}})
      .populate('user')
      .populate('owner', 'username')
      .sort({createdDate:-1})
      res.json(findMyLabUsers)
  // const findMyLabUsers  = await Schedule.aggregate([
  //     {$match:{user: { $in: newObjectArr}}},
  //     {$lookup:{from:'users', localField:'user', foreignField:'_id', as:'user'}},
  //     {$lookup:{from:'users', localField:'owner', foreignField:'_id', as:'owner'}},
  //     {$project:{user:1,
  //               fields:"$$ROOT",
  //               owner:'$owner.username'
  //     }}
  //   ])
  //     res.json(findMyLabUsers)
} else {

  let myLabScheduledAnalysis = await Schedule.find({})
  .populate('user')
  .populate('owner', 'username')
  .sort({createdDate:-1})
  res.json(myLabScheduledAnalysis)
  // res.json({myLabScheduledAnalysis, page})
  // res.render('index')
  }
}


exports.verify = (req,res) => {
  res.render('verify')
}

exports.verifyToken = async (req, res) => {
  if(req.body.emailToken.length<5 || req.body.emailToken.length>5) {
    req.flash('error_msg', 'Kod za verifikaciju nije ispravan, pokušajte ponovo')
    res.redirect('/verify')
  } else {
    let verifyAccount = await User.findOneAndUpdate(
      {emailToken:req.body.emailToken},
      {isVerified:true,
      emailToken:''},
      {new:true,
      useFindAndModify:false}).exec()
      if(verifyAccount) {
      req.flash('success_msg', 'Dobrodošli, uspešno ste verifikovali nalog, sada se možete ulogovati.')
      res.redirect('/prijava')
    } else {
      req.flash('error_msg', 'Verifikacioni kod nije dobar, pokušajte ponovo')
      res.redirect('/verify')
    }
  }
}

exports.forgot = (req,res) => {
  res.render('forgot')
}

exports.resetPassLink = async (req,res) => {

  let token
  const resetLinkExp = Date.now() + 360000
  //  crypto.randomBytes(30, (err,buf) => {
  //     token = buf.toString('hex')
  // })
  const buf = crypto.randomBytes(20)
  token =  buf.toString('hex')

  const findUser = await User.findOne({email:req.body.email})

  if (!findUser) {
    req.flash('error_msg', 'Korisnik sa ovom mejl adresom nije registrovan')
    res.redirect('/registracija')
  } else {
    try {

      const findUserAndUpdate = await User.findOneAndUpdate(
        {email:req.body.email},
        {
          resetLink:token,
          resetLinkExpires:resetLinkExp
        },
        {
          new:true,
          runValidators:true,
          useFindAndModify:false
        }).exec()

        let mailOptions = {
          from:'labcubee@gmail.com',
          to:req.body.email,
          subject:'Reset lab cube lozinke',
          text:'',
          html:`<a href="http://${req.headers.host}/reset/${token}"a>kliknite ovde</a>`
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
              return console.log(error)
          } else {
            console.log('message sent', info.messageId)
          }
          })
      req.flash('success_msg', 'prosledjen vam je mejl sa reset linkom')
      res.redirect('/')
    } catch(e) {
      req.flash('error_msg', `doslo je do greske ${e}`)
    }
  }
}

exports.resetPass = async (req,res) => {
   const findUser = await User.findOne({resetLink:req.params.token, resetLinkExpires:{$gt:Date.now()}})
   if(!findUser) {
     req.flash('error_msg', 'Neispravan link za promenu lozinke ili je link istekao')
     res.redirect('../prijava')
   } else {
     res.render('reset', {token:req.params.token})
   }
}

exports.updatePassword = async (req,res,next) => {
  const findUser = await User.findOne({resetLink:req.params.token, resetLinkExpires:{$gt:Date.now()}})
  if(!findUser) {
    req.flash('error_msg', 'Neispravan link za promenu lozinke ili je link istekao')
    res.redirect('../prijava')
  } else {
      if(req.body.password === req.body.confirm && req.body.password.length>6) {
        bcrypt.genSalt(10, (err,salt) => {
         bcrypt.hash(req.body.password, salt, (err,hash) => {
           if(err) throw err
           findUser.password = hash
           findUser.save()
           findUser.resetLink = undefined
           findUser.resetLinkExpires = undefined
         })
       })
       req.flash('success_msg', 'Uspesno ste postavili novu lozinku, možete se ulogovati')
       res.redirect('/prijava')
       //direktno ulogovati korisnika
     } else {
       req.flash('error_msg', 'Proverite li se unete lozinke podudaraju i da li lozinka ima više od 6 karaktera')
       res.redirect(`/reset/${req.params.token}`)
     }
  }
}

exports.logout = (req,res) => {
  req.logout()
  res.redirect('/')
}
