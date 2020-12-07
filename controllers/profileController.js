const mongoose = require('mongoose')
const User = mongoose.model('User')
const Schedule = mongoose.model('Schedule')

exports.updateHealthProfile = async (req, res) => {
  //check values
  try {
  const profileUpdate = await User.findOneAndUpdate(
    {_id:req.params.id},
    {
      height:req.body.visina,
      weight:req.body.tezina,
      bmi:req.body.bmi,
      smoking:req.body.pusac,
      alcohol:req.body.alkohol,
      bloodPresure:req.body.pritisak,
      nutrition:req.body.ishrana,
      stress:req.body.stres,
      hoursExcercise:req.body.vezbe,
      sweets:req.body.secer,
      foodSuplements:req.body.dodaciIshrani,
      therapy:req.body.terapija,
      therapyComment:req.body.terapijaKomentar,
      currentStatus:req.body.trenutnoBolesni,
      currentStatusComment:req.body.trenutnaBolestKomentar,
      anamnesis:req.body.anamneza,
      anamnesisComment:req.body.anamnezaKomentar,
      menstruation:req.body.menstruacija,
      regularMenstruation:req.body.ciklusUredan,
      regularGinecologyChecks:req.body.redovanPregledGinekologa,
      pregnancy:req.body.trudnoca,
      breastfeeding:req.body.dojenje

    },
    {
      new:true,
      runValidators:true,
      useFindAndModify:false
    }).exec()
    req.flash('success_msg', 'Uspesno apdejtovani podaci o zdravstvenom profilu')
    res.redirect('/profile')
  }
  catch(e) {
    console.log(e)
  }
}

exports.updateProfile = async (req,res) => {
  try {
  const profileUpdate = await User.findOneAndUpdate(

    {_id:req.params.id},
    {
      username:req.body.ime,
      gender:req.body.pol,
      mobile:req.body.mobilniTelefon,
      birthYear:req.body.godinaRodjenja,
      address:req.body.adresa,
      city:req.body.city
    },{
      new:true,
      runValidators:true,
      useFindAndModify:false
    }).exec()
    req.flash('success_msg', 'Uspesno apdejtovani podaci o zdravstvenom profilu')
    res.redirect('/profile')
    }
    catch(e) {
      console.log(e)
    }
}

exports.getMyAppointments =  (req,res,next) => {
  console.log(req.user.id)
  // const myAppointments = await Schedule.find({user:req.user.id})
  // next()
}
