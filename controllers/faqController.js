const mongoose = require('mongoose')
const Faq = mongoose.model('Faq')

// exports.getFaqs = async (req,res) => {
//   const faqFP = await Faq.find({frontPage:true})
//   res.render('index', {
//     faqtitle:'Najčešće postavljana pitanja',
//     faqFP
//   })
// }

exports.allFaqs = async (req,res) => {
  const numOfFaqs = await Faq.find().countDocuments()
  const allFaqs = await Faq.find()
  // console.log(allFaqs)
  res.render('allFaqs', {
    title:'Sve pitanja',
    allFaqs,
    numOfFaqs
  })
}

exports.addFaq = (req,res) => {
  res.render('addFaq', {
    title:'Dodaj pitanje i odgovor'
  })
}

exports.createFaq = async (req,res) => {
  let errors = []
  if(!req.body.question) {
    errors.push({'text':'Obavezno je uneti pitanje'})
  }
  if(!req.body.answer) {
    errors.push({'text':'Obavezno je uneti naslov odgovor'})
  }
  if(errors.length>0) {
    res.render('addFaq',{
      title:'Dodaj novo pitanje i odgovor',
      errors
    })
  } else {
    const faq = new Faq(req.body)
    try{
      await faq.save()
      req.flash('success_msg','Novo pitanje je uspešno kreireno')
      res.redirect('/allFaqs')
    } catch(e) {
      req.flash('error_msg', `Dogodila se greška ${e} prilikom upisa novog pitanja`)
      res.redirect('/addFaq')
    }
  }
}


exports.editFaq = async (req,res) => {
  const faq = await Faq.findOne({_id:req.params.id})
  res.render('addFaq', {
    title:'Izmeni pitanje ili odgovor',
    faq
  })
}

exports.updateFaq = async (req, res) => {
  if(req.body.frontPage == undefined) {
    req.body.frontPage = false
  }  try {
    const faq = await Faq.findOneAndUpdate(
      {_id:req.params.id},
      req.body,
      {
        new:true,
        runValidators:true,
        useFindAndModify:false
      }
    )
    req.flash('success_msg', 'Uspesno apdejtovano pitanje/odgovor')
    res.redirect('/allFaqs')
  } catch(e) {
    req.flash('error_msg', `doslo je do greske ${e} prilikomm azuriranja pitanja/odgovora`)
    res.redirect('back')
    }
}

exports.deleteFaq= async (req,res) => {
  const deleteFaq = await Faq.findOneAndDelete({_id:req.params.id})
  req.flash('success_msg', 'Cesto postavljano pitanje je uspesno obrisano.')
  res.json()
}
