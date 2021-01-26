const mongoose = require('mongoose')
const dotenv = require('dotenv')
const passport = require('passport')
const validator = require("email-validator")
const bcrypt = require('bcrypt')
let User = mongoose.model('User')
let Schedule = mongoose.model('Schedule')
let Feedback = mongoose.model('Feedback')
const nodemailer = require('nodemailer')


const authCheck = (req,res, next) => {
  if(!req.user) {
    res.redirect('/prijava')
  } else {
    next()
  }
}

exports.scheduleVisit = async (req,res) => {

  let analysisArr = []
  let total = req.body[0].total
  let labId = req.body[2].labId

  let uzimanjeUzorka = (req.body[3].date.length>10) ? 'patronaza' : 'laboratorija'

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
      scheduledFor:req.body[3].date,
      commentLab:comment,
      commentCube:commentCube,
      feedback:feedback,
      owner:owner
    })
    try {
      await newSchedule.save()
      res.redirect('/hvala')
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
    req.flash('success_msg', 'Uspesno apdejtovani podaci o statusu')
    res.redirect('/profile/')
  // res.send(req.body['status'+req.params.scheduleId])
}

exports.thankyou = (req,res) => {
  res.render('hvala')
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
  res.render('resultsInterpretation', {resultsForInterpretation, title:'Tumačenje rezultata', page, countTotal, pages})
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
let test = []
let updateInterpretation


  for (let i = 0; i<req.body.value.length; i++) {
    if(req.body['outsideOfTheRange'+req.body.analysisId[i]] ==  undefined) {
      outsideOfTheRange = false
    } else {
      outsideOfTheRange = true
    }

    test.push({
      'id':req.body.analysisId[i],
      'value':req.body.value[i],
      'range':outsideOfTheRange
    })



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

exports.lockTheInterpretation =  async (req,res) => {
  // console.log(req.body[0].ownerId)
  // console.log(req.body[0].interpretationId)
  console.log(req.body[0])
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
