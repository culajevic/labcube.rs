const mongoose = require('mongoose')
const Group = mongoose.model('Group')
const Faq = mongoose.model('Faq')
const Analysis = mongoose.model('Analysis')
//for test only
const Price = mongoose.model('Price')
const Lab = mongoose.model('Lab')
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
    cb(null, 'src/images')
  },
  filename: function (req,file,cb)  {
    const fileExtension = mime.extension(file.mimetype)
    cb(null, `${file.originalname}-${Date.now()}.${fileExtension}`)
  }
})

const upload = multer({storage:storage})

exports.upload = upload.single('iconPath')


// add a new group to database
exports.createGroup = [authCheck, async (req,res) => {
  let errors = []
  if(!req.body.name) {
    errors.push({text:'Unesite ime grupe'})
  }
  if(!req.body.description) {
    errors.push({text:'Unesite opis grupe'})
  }
  if(errors.length > 0) {
    res.render('addGroup',{
      errors,
      title:'Dodaj novu grupu',
      name:req.body.name,
      description:req.body.description,
      iconPath:req.body.iconPath,
      frontPage:req.body.frontPage,
      priority:req.body.priority
    })
  } else {
    if(req.file) {
        req.body.iconPath = req.file.filename
      } else {
        req.flash('error_msg', 'doslo je do greske prilikom uploada')
      }

      const group = new Group(req.body)
      try {
        await group.save()
        req.flash('success_msg','Grupa analiza je uspešno kreirana')
        res.redirect('/allGroupsList')
        }
      catch (e){
        req.flash('error_msg', `Dogodila se greška prilikom upisa nove grupe u bazu ${e}`)
        res.redirect('/addGroup')
      }
  }
}]

// display groups on index page RENAME THIS ROUTE!!!!!!!
exports.getGroups = async (req,res) => {

// let getPricesdata = await Price.aggregate({$unwind:'$cenovnik'})

sortByPriority = {priority:-1}
  try {
    const faqFP = await Faq.find({frontPage:true}).sort(sortByPriority)
    // const groups = await Group.find({frontPage:true}).sort(sortByPriority)
    const numOfGroups = await Group.countDocuments({})
    const groups = await Analysis.aggregate([
      {$match:{active:true}},
      {$group:{_id:{groupId:'$groupId'},total:{$sum:1}}},
      {$lookup:{from:'groups', localField:"_id.groupId", foreignField:"_id", as:"grupa"}},
      //izbaciti match ispod ukoliok prikazujemo sve grupe na naslovnoj stranici
      // {$match:{'grupa.frontPage':true}},
      {$sort:{'grupa.priority':-1}}
    ])
    // const groups = await Group.aggregate([
    //   {$match:{}},
    //   {$lookup:{from: 'analyses', localField:"_id", foreignField:"groupId", as:"analiza"}}
    // ])
    // console.log(groups)

    const groupNames = await Group.find({},{name:1,slug:1,_id:0}).sort({name:1})
    const labNum = await Lab.countDocuments({active:true})
    const analysisNum = await Analysis.countDocuments({active:true})
    //trenutno otvorene laboratorije

    let  labInfo = await Lab.find({active:true}).populate('placeId')


    let now = new Date()
    let day = now.getDay()
    let date = now.getDate()
    let year = now.getFullYear()
    let month = now.getMonth()
    let today = (month + 1) + "/" + date + "/" + year
    let numOpen = 0
    let labStatus = []

    let currentDay
    let currentDayNum

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

    if(day == currentDayNum) {
      for(i=0; i<labInfo.length; i++) {
        let openTime = labInfo[i].workingHours[currentDay].opens
        let closingTime = labInfo[i].workingHours[currentDay].closes
        let todayOpenTime = new Date(today +' '+ openTime +':00')
        let todayClosingTime = new Date(today +' '+ closingTime +':00')
        let nowTimeStamp = now.getTime()
        closingSoon = todayClosingTime - nowTimeStamp
        let closingIn = (Math.ceil(closingSoon/1000/60))

        // if (closingIn < 60 && closingIn > 0) {
        //   status = 'closedSoon'
        //   labStatus.push({'id':labInfo[i]._id, 'status':status})
        // }

        if(nowTimeStamp > todayOpenTime.getTime() &&
          todayClosingTime.getTime() > nowTimeStamp) {
          numOpen +=1
          status = 'open'
          labStatus.push({'id':labInfo[i]._id, 'status':status})
        }
        else {
          status = 'closed'
          labStatus.push({'id':labInfo[i]._id, 'status':status})
        }
      }
    }

      res.render('index',{
        title:'Uporedi cene laboratorijskih analiza i ostvari popust do 30%.',
        faqtitle:'Najčešće postavljana pitanja',
        metaDescription:'Uporedi cene i prosledi potrebne analize odabranoj laboratoriji, ostvari popust i pravo na besplatno tumačenje rezultata. Svi tvoji rezultati su na jednom mestu.',
        metaKeywords:'Poređenje cena laboratorijskih analiza, Biohemijske analize, laboratorije, tumačenje rezultata, krvna slika, online patronaža',
        groups,
        faqFP,
        labNum,
        analysisNum,
        numOpen,
        numOfGroups,
        groupNames,
        user:req.user,
        labDetails : encodeURIComponent(JSON.stringify(labInfo)),
        labOpen : encodeURIComponent(JSON.stringify(labStatus))
      })

  } catch(e) {
    req.flash('error_msg', `Doslo je do greske, pokusajte kasnije ${e}`)
  }
}


// display single group // TODO: create page for single group display
exports.displayGroup = async (req,res) => {
  const group = req.params.slug
  const groupDetails = await Group.findOne({slug:group},{iconPath:1, description:1, name:1})
  const groupNames = await Group.find({},{name:1,slug:1,_id:0}).sort({name:1})
  const ObjectId = mongoose.Types.ObjectId
  try {
  const analysis = await Price.aggregate([
    {$unwind : "$cenovnik"},
    {$group: {_id:'$cenovnik.analiza', minPrice:{$min:'$cenovnik.cena'}, maxPrice:{$max:'$cenovnik.cena'}}},
    {$lookup: {from:'analyses', localField:'_id', foreignField:'_id', as:'analiza'}},
    {$match: {'analiza.active':true}},
    {$match : {'analiza.groupId':ObjectId(groupDetails._id)}},
    {$project:{name:'$analiza.analysisName',
              abbr:'$analiza.abbr',
              alt:'$analiza.alt',
              availableHC:'$analiza.availableHC',
              preview:'$analiza.preview',
              slug:'$analiza.slug',
              groupId:'$analiza.groupId',
              minPrice:1,
              maxPrice:1,
              iconPath:groupDetails.iconPath}},
      {$sort:{name:1}}
  ])

  res.render('groupDetails',{
    group:groupDetails,
    analyisisdata:analysis,
    metaDescription:groupDetails.description,
    metaKeywords:groupDetails.name,
    title:`Grupa | ${groupDetails.name}`,
    groupNames,
    user:req.user
  })
}
catch {
  res.render('404page', {'title':'Ova stranica ne postoji'})
  }
}

// display form for adding a new group
exports.addGroup = [authCheck, (req,res) => {
  res.render('addGroup', {
    title:'Dodaj novu grupu analiza'
  })
}]

// display single group for edit
exports.editGroup = [authCheck, async (req,res) => {
  try{
    const group = await Group.findOne({name:req.params.name})
    res.render('addGroup',{
      title:`${group.name}`,
      group
    })
  } catch(e) {
    req.flash('error_msg', `doslo je do greske ${e}`)
    res.redirect('/addGroup')
  }
}]

exports.updateGroup = [authCheck, async (req,res) => {
  if (req.body.frontPage == undefined) {
    req.body.frontPage = false
  }
  if(req.file) {
    req.body.iconPath = req.file.filename
  }
  req.body.lastUpdate = Date.now()
  try {
  const group = await Group.findOneAndUpdate(
    {name:req.params.name},
    req.body,
    {
      new:true,
      runValidators:true,
      useFindAndModify:false
    }).exec()
    req.flash('success_msg', 'Uspesno apdejtovani podaci o grupi')
    res.redirect('/allGroupsList')
  } catch(e) {
    console.log(e)
  }
}]


// display all groups in backend as a list
exports.listAllGroups = [authCheck, async(req,res) => {
  // const countGroups = await Group.find().count()
  const allGroups = await Group.find().sort({name:1})
    res.render('allGroupsList',{
      title:'Sve grupe analiza',
      allGroups
    })
}]

exports.getGroupNames = async (req,res) => {
  const group = await Group.find({name:{ "$regex": req.params.groupName , "$options": "i" }})
  res.json(group)
}

exports.deleteGroup = [authCheck, async (req,res) => {
  const deleteGroup = await Group.findOneAndDelete({_id:req.params.id})
  req.flash('success_msg', 'Grupa je uspesno obrisana.')
  res.json()
}]
