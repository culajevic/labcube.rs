const mongoose = require('mongoose')
const Lab = mongoose.model('Lab')
const Analysis = mongoose.model('Analysis')
const ObjectId = mongoose.Types.ObjectId
const Price = mongoose.model('Price')
const Feedback = mongoose.model('Feedback')
const Group = mongoose.model('Group')
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
      companyNumber:req.body.companyNumber,
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
      antigen:req.body.antigen,
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
  const labsNumber = await Lab.find().countDocuments()
  const allLab = await Lab.find({}).populate('placeId').sort({labName:1})
  res.render('allLabs', {
    title:'Sve laboratorije',
    allLab,
    number:labsNumber
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
  if (req.body.antigen == undefined) {
    req.body.antigen = false
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
  let checkToday = new Date()
  const labDetails = await Lab.findOne({slug:{"$regex":req.params.slug, "$options": "i" }})
  .populate('placeId', 'place municipality')
  let user = req.user
  let alreadySent
  //getLabScore
  // let labStar = await Lab.findOne({_id:labDetails.id})
  //
  if (user) {
    //ako je user ulogovan i ima objvaljen komentar ali je istekao datum za objavu novog komentara prikazi mu formu za komentar
    alreadySent = await Lab.aggregate([
      {$match:{_id:ObjectId(labDetails.id)}},
      {$unwind:'$commentSection'},
      {$match:{'commentSection.userId':ObjectId(user.id)}},
      // {$match:{$and:[{'commentSection.approved':true},{'commentSection.newCommentPossible':{$gt:checkToday}}]}},
      {$match:{'commentSection.newCommentPossible':{$gt:checkToday}}},
      {$project:{commentSection:1}}
    ])
  } else {
    alreadySent = await Lab.aggregate([
      {$match:{_id:ObjectId(labDetails.id)}},
      {$unwind:'$commentSection'},
      // {$match:{$and:[{'commentSection.approved':true},{'commentSection.newCommentPossible':{$gt:checkToday}}]}},
      {$match:{'commentSection.approved':false}},
      {$project:{commentSection:1}}
    ])
  }

  //check if user already submited a feedback
  let alreadySentFlag = (alreadySent.length) ? true : false

  let feedbackSent = await Lab.aggregate([
    {$match:{_id:ObjectId(labDetails.id)}},
    {$unwind:'$commentSection'},
    {$lookup:{from:'users', localField:'commentSection.userId', foreignField:'_id', as:'user'}},
    {$match:{'commentSection.approved':true}},
    {$sort:{'commentSection.date':-1}},
    {$project:{commentSection:1, user:1}}
  ])

  let numComments = feedbackSent.length

  let numOfFeedbacks = parseInt(feedbackSent.length)
  let sum = 0
  for (let i = 0; i<numOfFeedbacks; i++) {
    sum+= parseInt(feedbackSent[i].commentSection.star)
  }
  let star = (sum / numOfFeedbacks).toFixed(2)
  ////////////////////////////////////////////////////////////////

  //get groupnames for footer
  const groupNames = await Group.find({},{name:1,slug:1,_id:0}).sort({name:1})

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
    closingSoon = todayClosingTime - nowTimeStamp
    let closingIn = (Math.ceil(closingSoon/1000/60))

    if (closingIn < 60 && closingIn > 0) {
      status = 'closedSoon'
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

  res.render('labdetails', {sidebarNav:false, title:labDetails.labName, labDetails,status, total, numComments, alreadySentFlag, feedbackSent, star, numOfFeedbacks, currentDayNum, selectedAnalysis, numofanalysis, userId, userName, hospitality, venipuncture, speed, covid, overall, user, groupNames})

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
    {$match:{'name':{$regex:req.params.analysisName, $options: 'i'}}},
    {$lookup:{from:'groups', localField:'group', foreignField:'_id', as:'groupID'}},
    {$sort:{name:1}}
  ])
  console.log(searchForAnalysis)
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


exports.sendFeedback = async (req,res) => {
  let labSlug = await Lab.findOne({_id:req.params.id})
  let ipAddress = req.header('x-forwarded-for') || req.connection.remoteAddress
  let today = new Date()
  //Proveriti da li je neko menjao ocenu ako jeste, izbaciti ga
  if (req.body.star < 1 || req.body.star > 5) {
    req.flash('error_msg', `Došlo je do greske prilikom slanja komentara, pokušajte ponovo`)
    res.redirect('/laboratorija/'+labSlug.slug)
    return false
  }

  //proveriti da li je korisnik sa ove ip adrese vec dao komentar za ovaj lab
  let feedbackSent = await Lab.aggregate([
    {$match:{_id:ObjectId(req.params.id)}},
    {$unwind:'$commentSection'},
    {$match:{'commentSection.ip':ipAddress}},
    {$match:{'commentSection.userId':ObjectId(req.user.id)}},
    {$match:{'commentSection.approved':true}},
    {$project:{commentSection:1}}
  ])

  for (let i = 0; i<feedbackSent.length; i++) {
    if (feedbackSent[i].commentSection.newCommentPossible > today) {
      req.flash('error_msg', `Već ste ocenili labortoriju.`)
      res.redirect('/laboratorija/'+labSlug.slug)
      return false
    }
  }

  try {
    let labStar = await Lab.findOne({_id:req.params.id})
    let numOfFeedbacks = parseInt(labStar.commentSection.length)
    let sum = 0
    for (let i = 0; i<numOfFeedbacks; i++) {
      sum+= parseInt(labStar.commentSection[i].star)
    }
    let star = (sum / numOfFeedbacks).toFixed(2)


    let labFeedback = await Lab.findOneAndUpdate(
      {_id:req.params.id},
      {$push:{'commentSection':{'feedback':req.body.labFeedback,'star':req.body.star, ip:ipAddress, userId:req.user.id}}},
      {
        new:true,
        runValidators:true,
        useFindAndModify:false
      }).exec()
      req.flash('success_msg','Uspešno ste poslali komentar. Hvala')
      res.redirect('/laboratorija/'+labSlug.slug)
  }
  catch(e) {
    req.flash('error_msg', `Došlo je do greske ${e} prilikom slanja komentara`)
  }
}


exports.allComments = async (req,res) => {
  let allComments = await Lab.aggregate([
    {$unwind:'$commentSection'},
    {$match:{'commentSection.approved':false}},
    {$lookup:{from:'users', localField:'commentSection.userId', foreignField:'_id', as:'user'}},
    {$project:{commentSection:1, labName:1, user:1}}
  ])
  res.render('allComments', {allComments, title:'Uređivanje komentara'})
}

exports.approveComment = async (req,res) => {

  // let commentApproval = await Lab.aggregate([
  //   {$unwind:'$commentSection'},
  //   {$match:{'commentSection._id':ObjectId(req.params.id)}},
  //   {$project:{commentSection:1, _id:0}}
  // ])
  // console.log(commentApproval[0].commentSection._id)     {commentSection:{$elemMatch:{_id:ObjectId(req.params.commentId)}}},
  let updateApproval = await Lab.updateOne(
    {'commentSection._id':ObjectId(req.params.commentId)},
    {$set: {'commentSection.$.approved': true}})
    req.flash('success_msg','Komentar je odobren')
    res.redirect('/allComments')
}

exports.deleteComment = async (req,res) => {
    let deleteComment = await Lab.updateOne(
      {'commentSection._id':ObjectId(req.params.commentId)},
      {$pull:{commentSection:{_id:ObjectId(req.params.commentId)}}}
    )
      req.flash('success_msg','Uspešno obrisan komentar')
      res.redirect('/allComments')
}

exports.deleteApprovedComment = async (req,res) => {
    let deleteComment = await Lab.updateOne(
      {'commentSection._id':ObjectId(req.params.commentId)},
      {$pull:{commentSection:{_id:ObjectId(req.params.commentId)}}}
    )
      req.flash('success_msg','Uspešno obrisan komentar')
      res.redirect('/allApprovedComments')
}

exports.allApprovedComments = async (req, res) => {
  let allApprovedComments = await Lab.aggregate([
    {$unwind:'$commentSection'},
    {$match:{'commentSection.approved':true}},
    {$lookup:{from:'users', localField:'commentSection.userId', foreignField:'_id', as:'user'}},
    {$project:{commentSection:1, labName:1, 'user.username':1}}
  ])
  res.render('approvedComments', {allApprovedComments, title:'Labcube - Odobreni komentari'})
}

exports.getListOfLabs = async (req,res) => {
  let getAllLabsInfo = await Lab.find({}).populate('placeId', 'place municipality').sort({labName:1})
  res.render('laboratorije', {title:'Sve laboratorije', getAllLabsInfo})
}
