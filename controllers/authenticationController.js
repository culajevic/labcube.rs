const mongoose = require('mongoose')
const dotenv = require('dotenv')
const passport = require('passport')
const validator = require("email-validator")
const bcrypt = require('bcrypt')
let User = mongoose.model('User')
const Schedule = mongoose.model('Schedule')
const Lab = mongoose.model('Lab')
const Place = mongoose.model('Place')
const nodemailer = require('nodemailer')
const moment = require('moment')
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
  res.render('signin')
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
  if(req.user.admin == 0) {
    const myAppointments = await Schedule.find({user:req.user.id})
    .populate('lab')
    .sort({createdDate:-1})
    let cities = await Place.distinct("municipality")
    const numOfMyAnalysis = myAppointments.length

    res.render('profile',{
      user:req.user,
      cities:cities,
      myAppointments:myAppointments,
      numOfMyAnalysis:numOfMyAnalysis
    })
    // res.send(`<a href=/logout>log out</a> ${req.user.username}`)
  } else {
    res.redirect('/admindashboard')
  }
}]

exports.registerForm = (req,res) => {
  res.render('register')
}

exports.admindasboard =  [authCheck, (req,res) => {
  let errors = []
  if(req.user.admin == 1) {
    res.render('admindashboard')
  } else {
    errors.push({text:'Nice try'})
    res.render('signin',{errors})

  }
}]

exports.register =  async (req,res) => {
  let errors = []
  let {email,password} = req.body
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
        res.render('register',{errors})
      } else {

        const newUser = new User({
          username:email,
          email:email,
          signupDate:Date.now(),
          isVerified:false,
          admin:0,
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

exports.logout = (req,res) => {
  req.logout()
  res.redirect('/')
}
