const mongoose = require('mongoose')
const Analysis = mongoose.model('Analysis')
const Price = mongoose.model('Price')
const Group = mongoose.model('Group')
const Message = mongoose.model('Message')
const nodemailer = require('nodemailer')
const ip = require('ip')
const moment = require('moment')
moment.locale('sr')


exports.aboutus = async (req,res) => {
  const groupNames = await Group.find({},{name:1,slug:1,_id:0}).sort({name:1})
  res.render('aboutus',{
    title:'O nama',
    groupNames,
    user:req.user
  })
}

exports.privacy = async (req,res) => {
  const groupNames = await Group.find({},{name:1,slug:1,_id:0}).sort({name:1})
  res.render('privacy',{
    title:'Politika privatnosti',
    groupNames,
    user:req.user
  })
}

exports.terms = async (req,res) => {
const groupNames = await Group.find({},{name:1,slug:1,_id:0}).sort({name:1})
  res.render('terms',{
    title:'Uslovi korišćenja',
    groupNames,
    user:req.user
  })
}

exports.paymentDetails = async (req,res) => {
const groupNames = await Group.find({},{name:1,slug:1,_id:0}).sort({name:1})
  res.render('paymentDetails',{
    title:'Uslovi plaćanja',
    groupNames,
    user:req.user
  })
}

exports.sayHello = async (req,res) => {
  const groupNames = await Group.find({},{name:1,slug:1,_id:0}).sort({name:1})
  res.render('contact', {title:'Labcube Kontakt', groupNames})
}

exports.takeUserComment = async (req,res) => {


  let transporter = nodemailer.createTransport({
    host:'mail.labcube.rs',
    port:465,
    secure:true,
    auth: {
        user:"zdravo@labcube.rs",
        pass:process.env.EMAILPASSHELLO
    },
    tls: {
          rejectUnauthorized: false
      }
  })



  // let ip = req.header('x-forwarded-for') || req.connection.remoteAddress
let ipAddress = ip.address()
console.log(req.body)

  let errors = []

  let mailOptions = {
    from:req.body.email,
    to:'jevtic@labcube.rs, perovic@labcube.rs, culajevic@labcube.rs',
    subject:'Pitanje sa labcube.rs',
    text:'',
    html:`<p>Zdravo, moje ime je: ${req.body.name}</p><p>Moje pitanje je: ${req.body.message}</p>`
  }

  if (req.body.name == '' || req.body.email == '' || req.body.message == '') {
    errors.push({text:'Sva polja su obavezna'})
    req.flash('error_msg', `Sva polja su obavezna`)
    res.redirect('/contact')
  }

  else if(req.body.odjebjelansiran != '') {
    res.redirect('https://youtu.be/bKqvO9-pjqo')
  }
  else {
    let submitQuestion = new Message({
      name:req.body.name.trim(),
      email:req.body.email.trim(),
      message:req.body.message.trim(),
      ip:ipAddress
    })
    try{
      await submitQuestion.save()
      req.flash('success_msg','Uspešno ste poslali pitanje. Uskoro ćemo Vam se javiti')
      res.redirect('/')

      transporter.sendMail(mailOptions, (error, info) => {
          if(error) {
            return console.log(error)
        } else {
          console.log(info.messageId)
        }
      })
    } catch(e) {
      req.flash('error_msg', `Dogodila se greška ${e} prilikom upisa novog pitanja`)
      res.redirect('/contact')
    }

  }



}
