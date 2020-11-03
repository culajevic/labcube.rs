const mongoose = require('mongoose')
const Reference = mongoose.model('Reference')

exports.allReferences = async (req,res) => {
  const numOfReferences = await Reference.find().countDocuments()
  const allReferences = await Reference.find().sort({referenceTitle:1})
  res.render('allReferences', {
    title:'Reference',
    numOfReferences,
    allReferences
  })
}

exports.addReference = (req,res) => {
  res.render('addReference', {
    title:'Dodaj referencu'
  })
}

exports.createReference = async (req,res) => {
  let errors = []
  if(!req.body.referenceTitle) {
    errors.push({'text':'Obavezno je uneti naslov reference'})
  }
  if(errors.length>0) {
    res.render('addReference',{
      title:'Dodaj novu referencu',
      errors
    })
  } else {
    const reference = new Reference(req.body)
    try{
      await reference.save()
      req.flash('success_msg','Nova referenca je uspešno kreirana')
      res.redirect('/allReferences')
    } catch(e) {
      req.flash('error_msg', `Dogodila se greška ${e} prilikom upisa nove reference`)
      res.redirect('/addReference')
    }
  }
}


exports.editReference = async (req,res) => {
  const reference = await Reference.findOne({_id:req.params.id})
  res.render('addReference', {
    title:'Izmeni referencu',
    reference
  })
}

exports.updateReference = async (req, res) => {
  try {
    const reference = await Reference.findOneAndUpdate({_id:req.params.id},
      req.body,
      {
        new:true,
        runValidators:true,
        useFindAndModify:false
      }
    )
    req.flash('success_msg', 'Uspesno apdejtovani podaci o referenci')
    res.redirect('/allReferences')
  } catch(e) {
    req.flash('error_msg', `doslo je do greske ${e} prilikomm azuriranja podataka o referenci`)
    res.redirect('back')
    }
}

exports.getReferences = async(req,res) => {
  const references = await Reference.find({referenceTitle:{"$regex":req.params.referenceTitle, "$options":"i"}})
  res.json(references)
}

exports.deleteReference = async (req,res) => {
  const deleteReference = await Reference.findOneAndDelete({_id:req.params.id})
  req.flash('success_msg', 'Referenca je uspesno obrisana.')
  res.json()
}
