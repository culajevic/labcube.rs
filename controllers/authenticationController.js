const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const dotenv = require('dotenv')
const passport = require('passport')
const validator = require("email-validator")
const bcrypt = require('bcrypt')
const User = mongoose.model('User')
const Schedule = mongoose.model('Schedule')
const Price = mongoose.model('Price')
const Analysis = mongoose.model('Analysis')
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
// let transporter = nodemailer.createTransport({
//   host:'smtp.gmail.com',
//   service:'gmail',
//   port:464,
//   auth: {
//       type: "OAUTH2",
//       user: "labcubee@gmail.com",
//       clientId: process.env.CLIENTID,
//       clientSecret: process.env.CLIENTSECRET,
//       refreshToken: process.env.REFRESHTOKEN,
//       accessToken:process.env.ACCESSTOKEN
//   }
// })

let transporter = nodemailer.createTransport({
  host:'mail.labcube.rs',
  port:465,
  secure:true,
  auth: {
      user:"labcube-no-reply@labcube.rs",
      pass:process.env.EMAILNEWACCOUNT
  },
  tls: {
        rejectUnauthorized: false
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


//
// exports.logout = (req, res) => {
//   res.send('logout')
// }

//start with google
exports.google =  passport.authenticate('google',{scope:['openid', 'email', 'profile']})

exports.redirect = [passport.authenticate('google'),
  (req,res) => {res.redirect('/profile')}]

const authCheck = (req,res, next) => {
  if(!req.user) {
    // res.redirect('/prijava', {title:'Labcube - Prijavite se'})
    res.render('signin', {title:'Labcube - Prijavite se'})
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
    else if(req.user.admin == 0 && (req.user.deleted == false || req.user.deleted == undefined)) {
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
      groupNames,
      title:'Labcube - Moj kontrolni panel'
    })
    // res.send(`<a href=/logout>log out</a> ${req.user.username}`)
  }

  else {
    // console.log('dsds')
    res.redirect('/admindashboard')
  }
}]

exports.registerForm = (req,res) => {
  res.render('register',{title:'Labcube - Kreirajte nalog'})
}

exports.admindasboard =  [authCheck, async (req,res) => {
  let errors = []
  if(req.user.admin == 1) {

    //prikaz analiza koje nemaju cenu
    let allAnalysisArr = []
    let missingPriceArr = []


    // ispis broja korisnika
    let numOfUsers = await User.find({}).countDocuments()

    //ispis broja komentara koji čekaju odobrenje
    let allComments = await Lab.aggregate([
      {$unwind:'$commentSection'},
      {$match:{'commentSection.approved':false}},
      {$lookup:{from:'users', localField:'commentSection.userId', foreignField:'_id', as:'user'}},
      {$project:{commentSection:1, labName:1, user:1}}
    ])
    let numOfPendingComments = allComments.length

    let allAnalysis = await Analysis.find({})
      for (let i = 0; i<allAnalysis.length; i++){
        allAnalysisArr.push(allAnalysis[i]._id.toString())
      }

      let missingLabPrice = await Price.aggregate([
         {$unwind:'$cenovnik'},
         {$group:{_id:'$cenovnik.analiza'}}
       ])

       for (let i = 0; i<missingLabPrice.length; i++) {
         missingPriceArr.push(missingLabPrice[i]._id.toString())
       }

      let resultMissingLabPrices = allAnalysisArr.filter(item => !missingPriceArr.includes(item))
      let numOfMissingPriceAnalysis = resultMissingLabPrices.length
      /////////////////////////////////////////////////////////////////////////////////////

      //prikaz broja laboratorija koje nemaju cenu
      let allLabs = []
      let allLabsWithPrice = []
      let getallLabs = await Lab.find({})
       for (let i = 0; i<getallLabs.length; i++) {
         allLabs.push(getallLabs[i]._id.toString())
       }

      let missingPrice = await Price.aggregate([
         {$unwind:'$cenovnik'},
         {$group:{_id:'$lab'}},
         {$project:{lab:1}}
       ])

       for (let i = 0; i<missingPrice.length; i++) {
         allLabsWithPrice.push(missingPrice[i]._id.toString())
       }
       let result = allLabs.filter(item => !allLabsWithPrice.includes(item))
       let displayMissingPricesLab = await Lab.find({_id:{$in:result}},{labName:1, address:1, place:1}).populate('placeId','place').sort({labName:1})
       let numOfMissingPricesForLabs = displayMissingPricesLab.length
      ////////////////////////////////////////////////

    res.render('admindashboard', {title:'Admin panel', user:req.user, numOfMissingPriceAnalysis, numOfMissingPricesForLabs, numOfUsers, numOfPendingComments})
  } else if(req.user.lab == 1) {
    res.send('ne moze')
  } else {
    errors.push({text:'Nice try'})
    res.render('signin',{errors})
  }
}]

exports.register =  async (req,res) => {
  let errors = []
  let {email,password, privacy, conditions, news} = req.body
  news = (req.body.news) ? true : false
  if(!privacy || !conditions) {
    errors.push({text:'Potvrdite da ste pročitali i razumeli uslove korišćenja i politiku privatnosti.'})
  }
  if(!validator.validate(email)) {
    errors.push({text:'Email adresa nije ispravna'})
  }
  if (password.length<6) {
    errors.push({text:'Lozinka mora imati više od 6 karaktera'})
  }
  if (errors.length>0) {
    res.render('register',{errors, title:'Labcube - Kreirajte labcube nalog'})
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
          news:news,
          deleted:false,
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

          const output = ` <div style="width:700px;  margin-left:auto; margin-right:auto; display:block; text-align:center; margin-top:0; padding-top:0; padding-bottom:30px; font-family:sans-serif; font-size:20px; margin-bottom:60px; border-bottom-left-radius: 20px; border-bottom-right-radius:20px; background-image:linear-gradient(315deg, #e1e1e1, #ffffff);">
           <div style="background-image:url(cid:headerEmailBig); width:100%; height:140px; background-size:100%;  background-repeat: no-repeat;"></div>
           <div style="letter-spacing:2px; margin-bottom:40px; margin-top:40px; padding:30px;">
             <h1 style="opacity:0.7">${newUser.emailToken}</h1>
           </div>
          <div style="text-align:center; font-family:sans-serif; color:#1D88E5; padding-left:30px; padding-right:30px; padding-bottom:10px;"><h2>je Vaš kod za verifikaciju labcube naloga</h2></div>
          </div>`


          let mailOptions = {
            from:'labcube-no-reply@labcube.rs',
            to:newUser.email,
            subject:`Vaš kod za verifikaciju lab cube naloga: ${newUser.emailToken}`,
            text:'',
            html:output,
            attachments:[{
              filename: 'headerBigEmail.png',
              path: 'src/images/headerBigEmail.png',
              cid: 'headerEmailBig'}]
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

          req.flash('success_msg','Poslali smo Vam mejl sa kodom za aktivaciju naloga')
          res.render('verify',{title:'Labcube - Verifikacija naloga', email:email})
          }
        catch (e){
          req.flash('error_msg', `Dogodila se greška prilikom registracije ${e}`)
          res.render('register')
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
  console.log(req.user)
  const findMyLabUsers  = await Schedule
      .find({lab:req.user.labId, user: { $in: newObjectArr}})
      .find({user: { $in: newObjectArr}})
      .populate('user')
      .sort({createdDate:-1})
      res.json(findMyLabUsers)
      // console.log(findMyLabUsers)
}
  else {
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
      .find({user: { $in: newObjectArr}},{$or:[{status:'Završeno'},{status:'Uzorkovanje'}]})
      .populate('user')
      .populate('owner', 'username')
      .sort({createdDate:-1})
      res.json(findMyLabUsers)
      // console.log(findMyLabUsers)
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
  const resultsForInterpretation = await Schedule.find({$or:[{status:'Završeno'},{status:'Uzorkovanje'}]})
    .skip(skip)
    .limit(limit)
    .populate('lab')
    .populate('user')
    .populate('analyses.analysisId')
    .populate('owner')
    .sort({createdDate:-1})
  // let myLabScheduledAnalysis = await Schedule.find({})
  // .populate('user')
  // .populate('owner', 'username')
  // .sort({createdDate:-1})
  res.json(resultsForInterpretation)
  // res.json({myLabScheduledAnalysis, page})
  // res.render('index')
  }
}


exports.verify = (req,res) => {
  res.render('verify')
}

exports.verifyToken = async (req, res) => {
  if(req.body.emailToken.length<4 || req.body.emailToken.length>5) {
    req.flash('error_msg', 'Kod za verifikaciju nije ispravan, pokušajte ponovo')
    res.redirect('/verify')
  } else {
    console.log(req.body.emailVerification)
    let verifyAccount = await User.findOneAndUpdate(
      {emailToken:req.body.emailToken},
      {isVerified:true,
      deleted:false,
      emailToken:''},
      {new:true,
      useFindAndModify:false}).exec()
      if(verifyAccount) {
      req.flash('success_msg', 'Uspešno ste verifikovali nalog, sada se možete ulogovati.')
      res.render('signin', {email:req.body.emailVerification})
    } else {
      req.flash('error_msg', 'Verifikacioni kod nije dobar, pokušajte ponovo')
      res.redirect('/verify')
    }
  }
}

exports.forgot = (req,res) => {
  res.render('forgot',{title:'Labcube - Postavljanje nove lozinke'})
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
    res.render('/registracija', {title:'Labcube - Kreirajte nalog'})
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
          from:'labcube-no-reply@labcube.rs',
          to:req.body.email,
          subject:'Postavljanje nove labcube lozinke',
          text:'',
          html:` <div style="width:700px;  margin-left:auto; margin-right:auto; display:block; text-align:center; margin-top:0; padding-top:0; padding-bottom:30px; font-family:sans-serif; font-size:20px; margin-bottom:60px; border-bottom-left-radius: 20px; border-bottom-right-radius:20px; background-image:linear-gradient(315deg, #e1e1e1, #ffffff);">
           <div style="background-image:url(cid:headerEmailBig); width:100%; height:140px; background-size:100%;  background-repeat: no-repeat;"></div>
          <div style="text-align:center; font-family:sans-serif; color:#1D88E5; padding-left:30px; padding-right:30px; padding-bottom:10px;"><h2>Da biste postavili novu labcube lozinku</h2></div>
          <div style="margin-bottom:60px; padding:30px;">
          <h2 style="opacity:0.7"><a href="http://${req.headers.host}/reset/${token}" style="text-decoration:none; background-color:#FF6F6F; padding:20px; color:#fff; border-radius:5px;">kliknite ovde</a></h2>
          </div>
          </div>`,
          attachments:[{
            filename: 'headerBigEmail.png',
            path: 'src/images/headerBigEmail.png',
            cid: 'headerEmailBig'}]
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
              return console.log(error)
          } else {
            console.log('message sent', info.messageId)
          }
          })
      req.flash('success_msg', 'Prosleđen Vam je mejl sa linkom za reset lozinke')
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
     res.render('../prijava', {title:'Labcube - Prijava'})
   } else {
     res.render('reset', {token:req.params.token, title:'Labcube - Postavljanje nove lozinke'})
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
       console.log('ds')
       req.flash('success_msg', 'Uspesno ste postavili novu lozinku, možete se ulogovati')
       res.redirect('/prijava')
       //direktno ulogovati korisnika
     } else {
       req.flash('error_msg', 'Proverite li se unete lozinke podudaraju i da li lozinka ima više od 6 karaktera')
       res.render(`/reset/${req.params.token}`)
     }
  }
}

exports.deleteOtherResult =  [authCheck, async (req,res) => {
  if (req.params.location == 'otherResults') {
  const deleteResult = await Result.findOneAndDelete({_id:req.params.id})
  req.flash('success_msg', 'Rezultat je uspešno obrisan.')
  res.json()}
  else {
    const deleteLabCubeResult = await Schedule.findOneAndDelete({_id:req.params.id})
      req.flash('success_msg', 'Rezultat je uspešno obrisan.')
      res.json()
  }
}]

exports.logout = (req,res) => {
  req.logout()
  res.redirect('/')
}
