const mongoose = require('mongoose')
const Lab = mongoose.model('Lab')
const Analysis = mongoose.model('Analysis')
const ObjectId = mongoose.Types.ObjectId
const Price = mongoose.model('Price')
const Feedback = mongoose.model('Feedback')
const url = require('url');
const moment = require('moment')
moment.locale('sr')
const multer = require('multer')
const path = require('path')
const mime = require('mime-types')

const authCheck = (req,res, next) => {
  if(!req.user) {
    res.redirect('/prijava')
  } else {
    next()
  }
}

let storage = multer.diskStorage({
  destination:function (req,file,cb) {
    cb(null, 'src/images/lablogo')
  },
  filename: function (req,file,cb)  {
    const fileExtension = mime.extension(file.mimetype);
    cb(null, `${file.originalname}-${Date.now()}.${fileExtension}`)
  }
})


const upload = multer({storage:storage})
exports.upload = upload.single('logo')

// display add lab form
exports.addLab = [authCheck, (req,res) => {
  res.render('addLab', {
    title:'Dodaj novu laboratoriju'
  })
}]

// put lab into database
exports.createLab = [authCheck, async (req,res) => {
  let errors = []
  if(!req.body.labName) {
    errors.push({'text':'Unesi ime laboratorije'})
  }
  if(!req.body.placeId) {
    errors.push({'text':'Odaberi mesto, unesi minimum 3 karaktera da započneš pretragu'})
  }
  if(!req.body.city) {
    errors.push({'text':'Proveri da li je ispravan id mesta'})
  }
  if(!req.body.address) {
    errors.push({'text':'Unesi adresu'})
  }
  if(errors.length>0) {
    res.render('addLab', {
      errors,
      title:'Dodaj novu laboratoriju',
      id:req.body._id,
      labName:req.body.labName,
      slug:req.body.slug,
      discount:req.body.discount,
      placeId:req.body.placeId,
      address:req.body.address,
      city:req.body.city,
      municipality:req.body.municipality,
      postalCode:req.body.postalCode,
      phone:req.body.phone,
      web:req.body.web,
      email:req.body.email,
      vat:req.body.vatNumber,
      priority:req.body.priority,
      locationLAT:req.body.location.coordinates[0],
      locationLNG:req.body.location.coordinates[1],
      mondayOpens:req.body.workingHours.monday.opens,
      mondayCloses:req.body.workingHours.monday.closes,
      tuesdayOpens:req.body.workingHours.tuesday.opens,
      tuesdayCloses:req.body.workingHours.tuesday.closes,
      wednesdayOpens:req.body.workingHours.wednesday.opens,
      wednesdayCloses:req.body.workingHours.wednesday.closes,
      thursdayOpens:req.body.workingHours.thursday.opens,
      thursdayCloses:req.body.workingHours.thursday.closes,
      fridayOpens:req.body.workingHours.friday.opens,
      fridayCloses:req.body.workingHours.friday.closes,
      saturdayOpens:req.body.workingHours.saturday.opens,
      saturdayCloses:req.body.workingHours.saturday.closes,
      sundayOpens:req.body.workingHours.sunday.opens,
      sundayCloses:req.body.workingHours.sunday.closes,
      open24h:req.body.open24h,
      accredited:req.body.accredited,
      disability:req.body.disability,
      patronage:req.body.patronage,
      private:req.body.private,
      description:req.body.description,
      comment:req.body.description

    })
  } else {
    if(typeof(req.file) !== 'undefined') {
      req.body.logo = req.file.filename
    }
      const lab = new Lab(req.body)
      try {
        await lab.save()
        req.flash('success_msg','Nova laboratorija je uspešno kreirana')
        res.redirect('/allLabs')
        }
      catch (e){
        req.flash('error_msg', `Dogodila se greška ${e}`)
        res.redirect('/addLab')
      }
  }
}]

exports.allLabs = [authCheck, async (req,res) => {
  const allLab = await Lab.find({}).populate('placeId').sort({date:-1})
  res.render('allLabs', {
    title:'All labs',
    allLab
  })
}]

exports.editLab = [authCheck, async (req,res) => {
  const lab = await Lab.findOne({_id:req.params.id}).populate('placeId')
  res.render('addLab', {
    title:lab.labName,
    lab
  })
}]

exports.updateLab = [authCheck, async (req,res) => {
  if (req.body.open24h == undefined) {
    req.body.open24h = false
  }
  if (req.body.accredited == undefined) {
    req.body.accredited = false
  }
  if (req.body.disability == undefined) {
    req.body.disability = false
  }
  if (req.body.patronage == undefined) {
    req.body.patronage = false
  }
  if (req.body.private == undefined) {
    req.body.private = false
  }

  if(typeof(req.file) !== 'undefined') {
    req.body.logo = req.file.filename
  }

  req.body.date = Date.now()

  try {
  const lab = await Lab.findOneAndUpdate(
    {_id:req.params.id},
    req.body,
    {
      new:true,
      runValidators:true,
      useFindAndModify:false
    }).exec()
    req.flash('success_msg', 'Uspesno apdejtovani podaci o laboratoriju')
    res.redirect('/allLabs')
  } catch(e) {
    req.flash('error_msg', `doslo je do greske ${e} prilikom azuriranja podataka o laboratoriji`)
  }
}]

exports.deleteLab = [authCheck, async (req,res) => {
  const deleteLab = await Lab.findOneAndDelete({_id:req.params.id})
  req.flash('success_msg', 'Laboratorija je uspesno obrisana.')
  res.send('success')
}]


exports.getLabInfo = async (req,res) => {

  const labDetails = await Lab.findOne({slug:{"$regex":req.params.slug, "$options": "i" }})
  .populate('placeId', 'place municipality')
let user = req.user

  //display feedback for the lab
  const findFeedback = await Feedback.find({lab:labDetails.id})
  let hospitality = 0
  let venipuncture = 0
  let speed = 0
  let covid = 0
  let overall = 0
  for (let i = 0; i<findFeedback.length; i++){
    hospitality += ((findFeedback[i].hospitality) / findFeedback.length)
    venipuncture += ((findFeedback[i].venipuncture) / findFeedback.length)
    speed += ((findFeedback[i].speed) / findFeedback.length)
    covid += ((findFeedback[i].covid) / findFeedback.length)
  }
  hospitality = hospitality.toFixed(1)
  venipuncture = venipuncture.toFixed(1)
  speed = speed.toFixed(1)
  covid = covid.toFixed(1)
  overall = ((parseFloat(hospitality) + parseFloat(venipuncture) + parseFloat(speed) + parseFloat(covid))/4).toFixed(1)

  let userId
  let userName
  if (req.user != null) {
    userId = req.user._id
    userName = req.user.username
  } else {
      userId = ''
      userName = ''
  }

  let newids = []
  let selectedAnalysis
  let labId = labDetails._id
  let newObjectArr = []
  let numofanalysis
  let total = 0

    if(req.params.ids !== undefined) {
       newids = req.params.ids.split(',')
       numofanalysis = newids.length
        newObjectArr = newids.map(i => mongoose.Types.ObjectId(i))
       // selectedAnalysis = await Analysis.find({_id:{$in:newids}},{analysisName:1, abbr:1, alt:1, availableHC:1,
       // preview:1,slug:1, })
       selectedAnalysis = await Price.aggregate([
         {$match:{'lab':ObjectId(labId)}},
         {$unwind:"$cenovnik"},
         {$lookup:{from:'analyses', localField:'cenovnik.analiza', foreignField:'_id', as:'analiza'}},
         {$project:{cenovnik:1,
                    idAnalysis:'$analiza._id',
                    name:'$analiza.analysisName',
                    preview:'$analiza.preview',
                    abbr:'$analiza.abbr',
                    alt:'$analiza.alt',
                    availableHC:'$analiza.availableHC',
                    preview:'$analiza.preview',
                    slug:'$analiza.slug'
                  }},
          {$match:{'cenovnik.analiza':{$in:newObjectArr}}},
          {$sort:{name:1}}
       ])
       for(i=0; i<selectedAnalysis.length; i++) {
         total += selectedAnalysis[i].cenovnik.cena
       }
     }

  let now = new Date()
  let month = now.getMonth()
  let date = now.getDate()
  let year = now.getFullYear()
  let today = (month + 1) + "/" + date + "/" + year
  let day = now.getDay()

  let currentDay
  let currentDayNum
  //
  switch (day) {
    case 0:
      currentDay = 'sunday'
      currentDayNum = 0
      break
    case 1:
      currentDay = 'monday'
      currentDayNum = 1
      break
    case 2:
      currentDay = 'tuesday'
      currentDayNum = 2
      break
    case 3:
      currentDay = 'wednesday'
      currentDayNum = 3
      break
    case 4:
      currentDay = 'thursday'
      currentDayNum = 4
      break
    case 5:
      currentDay = 'friday'
      currentDayNum = 5
      break
    case 6:
      currentDay = 'saturday'
      currentDayNum = 6
      break
    default:
      console.log('dan nije ok')
  }

let status
let closingSoon

  if(labDetails.open24h) {
     status = 'open'
  } else if(day === currentDayNum) {
    let openTime = labDetails.workingHours[currentDay].opens
    let closingTime = labDetails.workingHours[currentDay].closes
    let todayOpenTime = new Date(today +' '+ openTime +':00')
    let todayClosingTime = new Date(today +' '+ closingTime +':00')
    let nowTimeStamp = now.getTime()
    let closingSoon = todayClosingTime - nowTimeStamp
    let closingIn = (Math.ceil(closingSoon/1000/60))

    if (closingIn < 60 && closingIn > 0) {
      status = 'closingSoon'
    }

      else if(nowTimeStamp > todayOpenTime.getTime() &&
          todayClosingTime.getTime() > nowTimeStamp) {
          status = 'open'
      }
      else {
          status = 'closed'
      }
    } else {
      console.log('lab nije odredio radno vreme')
    }

  res.render('labdetails', {sidebarNav:false, labDetails,status, total, currentDayNum, selectedAnalysis, numofanalysis, userId, userName, hospitality, venipuncture, speed, covid, overall, user})

}


exports.getAdditionalAnalysis = async (req,res) => {
  let findLab = await Lab.findOne({slug:req.params.labSlug})
  let labId = findLab._id
  let searchForAnalysis = await Price.aggregate([
    {$match:{'lab':ObjectId(labId)}},
    {$unwind:"$cenovnik"},
    {$lookup:{from:'analyses', localField:'cenovnik.analiza', foreignField:'_id', as:'analiza'}},
    {$project:{cenovnik:1,
               idAnalysis:'$analiza._id',
               name:'$analiza.analysisName',
               preview:'$analiza.preview',
               abbr:'$analiza.abbr',
               alt:'$analiza.alt',
               availableHC:'$analiza.availableHC',
               preview:'$analiza.preview',
               slug:'$analiza.slug',
               group:'$analiza.groupId'
             }},
    {$match:{'name':{$regex:req.params.analysisName, "$options": "i"}}},
    {$lookup:{from:'groups', localField:'group', foreignField:'_id', as:'groupID'}},
    {$sort:{name:1}}
  ])
  // console.log(searchForAnalysis[0].groupID[0].iconPath)
  res.json(searchForAnalysis)
  // let searchForAnalysis = await Analysis.aggregate([
  //   {$match:{'analysisName':{$regex:req.params.analysisName, "$options": "i"}}}
  // ])
}

// get lab name for price form
exports.getLab = async (req, res) => {
  const labName = await Lab.find({labName:{"$regex":req.params.lab, "$options": "i" }})
  .populate('placeId', 'place municipality')
  res.json(labName)
}
