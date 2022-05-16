const mongoose = require('mongoose')
const Analysis = mongoose.model('Analysis')
const Price = mongoose.model('Price')
const Group = mongoose.model('Group')
const Message = mongoose.model('Message')
const nodemailer = require('nodemailer')
const moment = require('moment')
moment.locale('sr')


exports.schedule = async (req,res) => {
  const groupNames = await Group.find({},{name:1,slug:1,_id:0}).sort({name:1})
  res.render('patronage',{
    title:'LabCube | Zakazivanje patronaže',
    groupNames,
    user:req.user
  })
}
