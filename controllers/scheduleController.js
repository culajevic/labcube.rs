const mongoose = require('mongoose')
const dotenv = require('dotenv')
const passport = require('passport')
const validator = require("email-validator")
const bcrypt = require('bcrypt')
let User = mongoose.model('User')
let Schedule = mongoose.model('Schedule')
let Group = mongoose.model('Group')
let Feedback = mongoose.model('Feedback')
let Result = mongoose.model('Result')
const nodemailer = require('nodemailer')
const moment = require('moment')

dotenv.config({path:'variables.env'})

const authCheck = (req,res, next) => {
  if(!req.user) {
    res.redirect('/prijava')
  } else {
    next()
  }
}

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

exports.scheduleVisit = async (req,res) => {

  let analysisArr = []
  let total = req.body[0].total
  let labId = req.body[3].labId
  let labCubePrice = req.body[2].labCubePrice

  let uzimanjeUzorka = (req.body[4].date.length>10) ? 'patronaza' : 'laboratorija'

  let value = 0
  let outsideOfTheRange = false
  let valueFrom = 0
  let valueTo = 0
  let lessThen = 0
  let greaterThen = 0
  let status = ''
  let comment = ''
  let commentCube = ''
  let commentResult = ''
  let measure = ''
  let feedback = false
  let owner = null

  for(i=0; i<req.body[1].analysis.length;i++) {
    analysisArr.push({"analysis":req.body[1].analysis[i].name,
    "analysisId":req.body[1].analysis[i].id,
    "value":value,
    "outsideOfTheRange":outsideOfTheRange,
    "valueFrom": valueFrom,
    "valueTo" : valueTo,
    "lessThen" : lessThen,
    "greaterThen" : greaterThen,
    "status" : status,
    "measure" : measure,
    "commentResult":commentResult})
  }

  // console.log(total)
  // console.log(analysisArr)
//   let schedule = req.body[3].date.split('-')
// console.log(schedule)
// let test = new Date()
//   let newDate = new Date(schedule[2],schedule[1]-1,schedule[0])
//   newDate.setHours(test.getHours() + 2)

  // console.log(req.body[3].date)

// console.log(typeof(schedule))

  let newSchedule = new Schedule({
      uzimanjeUzorka:uzimanjeUzorka,
      total:total,
      analyses:analysisArr,
      status:'Zakazano',
      user:req.user._id,
      lab:labId,
      scheduledFor:req.body[4].date,
      labCubePrice:req.body[2].labCubePrice,
      commentLab:comment,
      commentCube:commentCube,
      feedback:feedback,
      owner:owner
    })
    try {
      await newSchedule.save()
      res.redirect('/hvala',{user:req.user})
      }
    catch (e){
      req.flash('error_msg', `Dogodila se greška ${e}`)
      res.redirect('/')
    }
}

exports.updateSchedule = async (req,res) => {

  const updateSchedule = await Schedule.findOneAndUpdate(

    {_id:req.params.scheduleId},
    {status:req.body['status'+req.params.scheduleId],
    commentLab:req.body.komentar},
    {
      new:true,
      runValidators:true,
      useFindAndModify:false
    }).exec()
    req.flash('success_msg', 'Uspešno izmenjeni podaci o statusu')
    res.redirect('/profile/')
  // res.send(req.body['status'+req.params.scheduleId])
}

exports.thankyou = async (req,res) => {
  const groupNames = await Group.find({},{name:1,slug:1,_id:0}).sort({name:1})
  res.render('hvala',{user:req.user, groupNames})
}

exports.myResults = async (req,res) => {
  const myResults = await Schedule.findOne({_id:req.params.id})
  .populate('lab')
  .populate('user', 'username')
  .populate('analyses.analysisId')
  .populate('owner')
  res.render('myresults', {myResults})
}

exports.userFeedback = async (req,res) => {
  const updateSchedule = await Schedule.findOneAndUpdate(
    {_id:req.body.scheduleId},
    {feedback:true},
    {
      new:true,
      runValidators:true,
      useFindAndModify:false
    }).exec()


  let newFeedback = new Feedback({
    lab:req.body.lab,
    hospitality:req.body.hospitality,
    venipuncture:req.body.venipuncture,
    speed:req.body.speed,
    covid:req.body.covid,
    comment:req.body.comment
  })
    try {
      await newFeedback.save()
      req.flash('success_msg', 'Uspesno ste ocenili laboratoriju, hvala!')
      res.redirect('/profile')
      }
    catch (e){
      req.flash('error_msg', `Dogodila se greška ${e}`)
      res.redirect('/')
    }
}

exports.resultsInterpretation = [authCheck, async (req,res) => {

  const countTotal = await Schedule.countDocuments({$or:[{status:'Završeno'},{status:'Uzorkovanje'}]})
  const page = req.params.page || 1
  const limit = 4
  const pages = Math.ceil(countTotal / limit)
  const skip = (page * limit) - limit

  const resultsForInterpretation = await Schedule.find({$or:[{status:'Završeno'},{status:'Uzorkovanje'}]})
    .skip(skip)
    .limit(limit)
    .populate('lab')
    .populate('user')
    .populate('analyses.analysisId')
    .populate('owner')
    .sort({createdDate:-1})
  res.render('resultsInterpretation', {resultsForInterpretation, title:'Tumačenje rezultata', page, countTotal, pages, paginationURL:'resultsInterpretation'})
}]

exports.otherResultsInterpretation = [authCheck, async (req,res) => {
  const countTotal = await Result.countDocuments({})
  const page = req.params.page || 1
  const limit = 10
  const pages = Math.ceil(countTotal / limit)
  const skip = (page * limit) - limit

  const otherResultsForInterpretation = await Result.find({})
    .skip(skip)
    .limit(limit)
    .populate('userId')
    .populate('owner')
    .sort({submitedDate:-1})
    res.render('otherResultsInterpretation', {otherResultsForInterpretation, title:'Tumačenje ostalih rezultata', page, countTotal, pages, paginationURL:'otherResultsInterpretation'})
}]

exports.otherResultsInterpretationValues = [authCheck, async (req,res) => {
  const findOtherResult = await Result.find({_id:req.params.id})

    .populate('userId')
    res.render('interpretatedOtherResults.hbs', {findOtherResult:findOtherResult, user:req.user})
    // res.json(findOtherResult)

}]

exports.resultsInterpretationValues = [authCheck, async (req,res) => {
  const analysisValues = await Schedule.find({_id:req.params.id})
  .populate('lab')
  .populate('user')
  res.render('analysisInterpretation', {analysisValues, user:req.user})
}]

exports.analysisInterpretation = async (req,res) => {
// console.log(req.body['outsideOfTheRange'+req.body.analysisId[0]])

let outsideOfTheRange = []
// let test = []
let updateInterpretation


  for (let i = 0; i<req.body.value.length; i++) {
    if(req.body['outsideOfTheRange'+req.body.analysisId[i]] ==  undefined) {
      outsideOfTheRange = false
    } else {
      outsideOfTheRange = true
    }

    // test.push({
    //   'id':req.body.analysisId[i],
    //   'value':req.body.value[i],
    //   'range':outsideOfTheRange
    // })



  updateInterpretation = await Schedule.findOneAndUpdate(
    {_id:req.params.id, 'analyses.analysisId':req.body.analysisId[i]},
    {$set:{
      'analyses.$.value':req.body.value[i],
      'analyses.$.measure':req.body.measure[i],
      'analyses.$.commentResult':req.body.commentResult[i],
      'analyses.$.outsideOfTheRange':outsideOfTheRange,
      'analyses.$.lessThen':req.body.lessThen[i],
      'analyses.$.greaterThen':req.body.greaterThen[i],
      'analyses.$.valueFrom':req.body.valueFrom[i],
      'analyses.$.valueTo':req.body.valueTo[i],
      commentCube:req.body.commentCube
      }
    },
    {
      new:true,
      runValidators:true,
      useFindAndModify:false
    }).exec()
  }
  res.send(updateInterpretation)
}


exports.analysisOtherInterpretation = async (req,res) => {
// console.log(req.body['outsideOfTheRange'+req.body.analysisId[0]])
let newDate = moment(new Date()).format("DD/MM/YYYY HH:mm")
// let test = []
let outsideOfTheRange
let updateInterpretation
let analysisArr = []


// OBAVEZNO PROVERITI
for (let i = 0; i < req.body.analysisName.length; i++) {
  if(req.body['outsideOfTheRange'+i]  ==  undefined )  {
    outsideOfTheRange = false
  } else {
    outsideOfTheRange = true
  }


  analysisArr.push({
  "analysis":req.body.analysisName[i],
  "analysisId":req.body.analysisId[i],
  "value":req.body.value[i],
  'measure':req.body.measure[i],
  'lessThen':req.body.lessThen[i] ? req.body.lessThen[i] : 0,
  'greaterThen':req.body.greaterThen[i] ? req.body.greaterThen[i] : 0,
  'valueFrom':req.body.valueFrom[i],
  'valueTo':req.body.valueTo[i],
  'commentResult':req.body.commentResult[i],
  'outsideOfTheRange':outsideOfTheRange})


  updateOtherInterpretation = await Result.findOneAndUpdate(
    {_id:req.params.id},
    {$set:{
      analyses:analysisArr,
      commentCube:req.body.commentCube,
      status:req.body.publish
      }
    },
    {
      new:true,
      runValidators:true,
      useFindAndModify:false
    }).exec()
}
  req.flash('success_msg','Uspešno ste protumačili rezultate.')
  res.redirect('/otherResultsInterpretation/page/1')

  if(req.body.publish == 'Završeno') {
    let completedTime = await Result.findOneAndUpdate(
      {_id:req.params.id},
      {$set:{
        completedDate:Date.now()
        }
      },
      {
        new:true,
        runValidators:true,
        useFindAndModify:false
      }).exec()
    let mailOptionsSendInfo = {
      from:'labcube-tumacenje-no-reply@labcube.rs',
      to:req.body.email,
      // to:'culajevic@gmail.com',
      subject:'Protumačeni rezultati',
      text:'',
      html:`

      <div style="width:700px;  margin-left:auto; margin-right:auto; display:block; text-align:center; margin-top:0; padding-top:0; padding-bottom:30px; font-family:sans-serif; font-size:20px; margin-bottom:60px; border-bottom-left-radius: 20px; border-bottom-right-radius:20px; background-image:linear-gradient(315deg, #e1e1e1, #ffffff);">
      <div style="background-image:url(cid:headerEmailBig); width:100%; height:140px; background-size:100%;  background-repeat: no-repeat;"></div>
      <div style="text-align:center; font-family:sans-serif; color:#1D88E5;  padding-bottom:10px; padding-left:30px; padding-right:30px;"><h3>Vaši rezultati su protumačeni.</h3></div>
        <p><a href="https://labcube.rs/myResult/${req.params.id}" style="text-decoration:none; background-color:#1D88E5; padding:20px; color:#fff; border-radius:5px;">kliknite ovde da pogledate rezultate</a></p>
        <div style="border-bottom:1px solid #E0E4EC; margin-top:40px;">
         <p style="font-family:sans-serif; font-size:16px; opacity:0.6; line-height:24px; padding-bottom:30px; padding-left:30px; padding-right:30px;">Hvala što koristite naše usluge.</p>
        </div>
        <div style="text-align:center; margin-top:10px;  padding-left:30px; padding-right:30px;">
        <img style="width:30%; display-block;" src="cid:logoFooter" alt="labcube footer logo" title="labcube footer logo">
        </div>
        <a href="https://labcube.rs/politika-privatnosti" style="color:#9C9C9C; font-size:9px; display:inline;  opacity:0.6;  text-decoration:none;">politika privatnosti</a>
        <a href="https://labcube.rs/uslovi-koriscenja" style="color:#9C9C9C; font-size:9px; display:inline;  opacity:0.6;  text-decoration:none;">uslovi korišćenja</a>
         <p style="color:#9C9C9C; font-size:9px; padding-top:20px; opacity:0.6; padding-left:30px; padding-right:30px; text-decoration:none;">informacione tehnologije nouvelle d.o.o. 16. Oktobar 19, 11000 Beograd</p>
      </div>`,
      attachments:[{
        filename: 'headerBigEmail.png',
        path: 'src/images/headerBigEmail.png',
        cid: 'headerEmailBig'},
        {
          filename: 'logoFooter.png',
          path: 'src/images/logoFooter.png',
          cid: 'logoFooter'
        }]
    }
    transporter.sendMail(mailOptionsSendInfo, (error, info) => {
        if(error) {
          return console.log(error)
      } else {
        console.log(info.messageId)
      }
    })

  }
}


exports.lockTheInterpretation =  async (req,res) => {
  // console.log(req.body[0].ownerId)
  // console.log(req.body[0].interpretationId)

  let lockTheInterpretation = await Schedule.findOneAndUpdate(
    {_id:req.body[0].interpretationId},
    {owner:req.body[0].ownerId},
    {
      new:true,
      runValidators:true,
      useFindAndModify:false
    }).exec()
    res.send('ok je')
}

exports.lockTheOtherInterpretation =  async (req,res) => {
  // console.log(req.body[0].ownerId)
  // console.log(req.body[0].interpretationId)
  let check = await Schedule.find({$and:[ {_id:req.body[0].interpretationId},{owner:{$exists:true}}]}).countDocuments()
  console.log(check)
  if(check == 0) {
  let lockTheInterpretation = await Result.findOneAndUpdate(
    {_id:req.body[0].interpretationId},
    {owner:req.body[0].ownerId},
    {
      new:true,
      runValidators:true,
      useFindAndModify:false
    }).exec()
    res.send('ok je')
    console.log('zakljucano')
  }
  else {
    console.log('vec je zakljucano')
    // res.send('vec je zakljucano')
  }
}


exports.myResultLabCube = async (req,res) => {
  const groupNames = await Group.find({},{name:1,slug:1,_id:0}).sort({name:1})
  const myResults = await Result.findOne({$and:[{_id:req.params.id},{status:'Završeno'}]})
  .populate('analyses.analysisId', 'analysesName, shortDesc')
  .populate('owner', 'username aboutUser image')
  res.render('myResultsLabCube', {myResults, groupNames})
}
