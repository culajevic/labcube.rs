const mongoose = require('mongoose')
const dotenv = require('dotenv')
const passport = require('passport')
const validator = require("email-validator")
const bcrypt = require('bcrypt')
let User = mongoose.model('User')
let Schedule = mongoose.model('Schedule')
const nodemailer = require('nodemailer')


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
  let commentResult = ''
  let measure = ''

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
    "comment":comment,
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
      scheduledFor:req.body[3].date

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
    comment:req.body.komentar},
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

  res.render('myresults', {myResults})
}
