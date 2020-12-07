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

  console.log(req.body[3].date)

  for(i=0; i<req.body[1].analysis.length;i++) {
    analysisArr.push(req.body[1].analysis[i].name)
  }
  // console.log(total)
  // console.log(analysisArr)


  let newSchedule = new Schedule({
      // lab:23323,
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
