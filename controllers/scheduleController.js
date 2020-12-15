const mongoose = require('mongoose')
const dotenv = require('dotenv')
const passport = require('passport')
const validator = require("email-validator")
const bcrypt = require('bcrypt')
let User = mongoose.model('User')
let Schedule = mongoose.model('Schedule')
const nodemailer = require('nodemailer')


exports.scheduleVisit = async (req,res) => {

  // let test = req.params.scheduleString

  let analysisArr = []
  let total = req.body[0].total
  let labId = req.body[2].labId

  let uzimanjeUzorka = (req.body[3].date.length>10) ? 'patronaza' : 'laboratorija'


  for(i=0; i<req.body[1].analysis.length;i++) {
    analysisArr.push(req.body[1].analysis[i].name)
  }
  // console.log(total)
  // console.log(analysisArr)
//   let schedule = req.body[3].date.split('-')
// console.log(schedule)
// let test = new Date()
//   let newDate = new Date(schedule[2],schedule[1]-1,schedule[0])
//   newDate.setHours(test.getHours() + 2)

  console.log(req.body[3].date)

// console.log(typeof(schedule))

  let newSchedule = new Schedule({
      uzimanjeUzorka:uzimanjeUzorka,
      total:total,
      analiza:analysisArr,
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

exports.thankyou = (req,res) => {
  res.render('hvala')
}
