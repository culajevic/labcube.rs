const mongoose = require('mongoose')
const User = mongoose.model('User')
const Schedule = mongoose.model('Schedule')
const bcrypt = require('bcrypt')

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
    req.flash('success_msg', 'Uspešno ste izmenili podatkeo zdravstvenom profilu')
    res.redirect('/profile')
  }
  catch(e) {
    console.log(e)
  }
}

exports.updatePass = async (req,res) => {
  console.log(req.body)
  console.log(req.params)
  const findUser = await User.findOne({_id:req.params.id})
  if(!findUser) {
    req.flash('error_msg', 'Nešto nije ok')
    res.redirect('../profile')
  } else {
      if((req.body.password1 === req.body.password2) && req.body.password1.length>6) {
        bcrypt.genSalt(10, (err,salt) => {
         bcrypt.hash(req.body.password1, salt, (err,hash) => {
           if(err) throw err
           findUser.password = hash
           findUser.save()
         })
       })
       req.flash('success_msg', 'Uspešno ste resetovali lozinku')
       res.redirect('/profile')
       //direktno ulogovati korisnika
     } else {
       console.log('nije ok')
       req.flash('error_msg', 'Proverite li se unete lozinke podudaraju i da li lozinka ima više od 6 karaktera')
       res.redirect('/profile')
     }
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
    req.flash('success_msg', 'Uspešno ste izmenili podatke o zdravstvenom profilu')
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

exports.deleteUser = async (req,res) => {
  try {
  const deleteUser = await User.findOneAndUpdate({_id:req.params.id},{deleted:true},
    {
      new:true,
      runValidators:true,
      useFindAndModify:false
    }).exec()
    req.flash('success_msg', 'Uspešno ste obrisali Vaš nalog. Žao nam je. Uvek možete kreirati novi nalog.')
    res.redirect('/')
    }
    catch(e) {
      console.log(e)
    }

}
