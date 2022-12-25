const mongoose = require('mongoose')
const multer = require('multer')
const mime = require('mime-types')
const dotenv = require('dotenv')
const passport = require('passport')
const validator = require("email-validator")
const bcrypt = require('bcrypt')
let User = mongoose.model('User')
let Schedule = mongoose.model('Schedule')
let Group = mongoose.model('Group')
const Lab = mongoose.model('Lab')
let Feedback = mongoose.model('Feedback')
let Result = mongoose.model('Result')
const nodemailer = require('nodemailer')
const moment = require('moment')
const csvtojson = require('csvtojson')
let fs = require('fs');
const ObjectId = mongoose.Types.ObjectId

dotenv.config({path:'variables.env'})

const authCheck = (req,res, next) => {
  if(!req.user) {
    res.redirect('/prijava')
  } else {
    next()
  }
}

let storage = multer.diskStorage({
  destination:function (req, file, cb) {
    cb(null, 'src/resultsForUpload')
  },
  filename: function (req,file,cb)  {
    const fileExtension = mime.extension(file.mimetype)
    cb(null, `${file.originalname}-${Date.now()}.${fileExtension}`)
  }
})
const upload = multer({storage:storage,limits:{fileSize:1024*1024*5,fieldSize: 1024 * 512,fieldNameSize: 200},
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv') {
      cb(null, true);
    }
    else {
      cb(new multer.MulterError('dogodila se greška prilikom uploada'))
    }
  }
}).single('fileResult')

let transporter = nodemailer.createTransport({
  host:'mail.labcube.rs',
  port:465,
  secure:true,
  auth: {
      user:"labcube-no-reply@labcube.rs",
      pass:process.env.EMAILNEWACCOUNT
  },
  tls: {
        rejectUnauthorized: false
    },
  from: 'labcube-no-reply@labcube.rs'
})

exports.scheduleVisit = async (req,res) => {

  let analysisArr = []
  let total = req.body[0].total
  let labId = req.body[3].labId
  let labCubePrice = req.body[2].labCubePrice
  let getLabData = await Lab.find({_id:labId},{email:1, comment:1, labName:1, address:1, workingHours:1, phone:1, slug:1}).populate('placeId')
  let getEmailforSending = getLabData[0].email
  let discountCode = getLabData[0].comment
  let getUserData = await User.find({_id:req.user._id}, {email:1})
  let getUserEmail = getUserData[0].email
  
  // console.log(getLabData[0].workingHours['monday'].opens)

  // let uzimanjeUzorka = (req.body[4].date.length>10) ? 'patronaza' : 'laboratorija'

  

  let value = 0
  let outsideOfTheRange = false
  let valueFrom = 0
  let valueTo = 0
  let lessThen = 0
  let greaterThen = 0
  let status = ''
  let comment = ''
  let commentCube = ''
  let commentResult = ''
  let measure = ''
  let feedback = false
  let owner = null

  for(let i=0; i<req.body[1].analysis.length;i++) {
    analysisArr.push({"analysis":req.body[1].analysis[i].name,
    "analysisId":req.body[1].analysis[i].id,
    "value":value,
    "outsideOfTheRange":outsideOfTheRange,
    "valueFrom": valueFrom,
    "valueTo" : valueTo,
    "lessThen" : lessThen,
    "greaterThen" : greaterThen,
    "status" : status,
    "measure" : measure,
    "commentResult":commentResult})
  }

  let analysisForEmail = []
  for(let i=0; i<req.body[1].analysis.length;i++) {
    analysisForEmail.push(req.body[1].analysis[i].name )
  }


  let getBullets = analysisForEmail.map((item) => (
    `<li>${item}</li>`
  ))

  //send email to laboratory and labcube
  let mailOptionsSendInfo = {
    from:'LabCube <labcube-tumacenje-no-reply@labcube.rs>',
    to:[getEmailforSending],
    bcc:'culajevic@gmail.com',
    subject:`Novi pacijent | ${getEmailforSending}`,
    text:`Potrebne analize \n ${getBullets} \n ukupna cena je ${total} \n labcube.rs` ,
    html:`
    <h1>Novi LabCube pacijent</h1>
    <h2>Ukupna cena ${total} din.</h2>
    <h2>Potrebne analize</h2>
    <ol>${getBullets.join(' ')}</ol>
    <a href="https://labcube.rs">labcube.rs</a>
    `
   
    // attachments:[
    //   {
    //     filename: 'sentToLabHeader.png',
    //     path: 'src/images/sentToLabHeader.png',
    //     cid: 'sentToLabHeader'}
    //   ]
  }

  let sendEmailtoCustomer = {
    from:'LabCube <labcube-tumacenje-no-reply@labcube.rs>',
    to:[getUserEmail],
    bcc:'culajevic@gmail.com',
    subject:'Uspešno odabrane analize',
    html:`
    <!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>LabCube online odabir analiza</title>
    <style>
      /* -------------------------------------
          GLOBAL RESETS
      ------------------------------------- */
      
      /*All the styling goes here*/
      
      img {
        border: none;
        -ms-interpolation-mode: bicubic;
        max-width: 100%; 

      }

      body {
        background-color: #f6f6f6;
        -webkit-font-smoothing: antialiased;
        font-size: 14px;
        line-height: 1.4;
        margin: 0;
        padding: 0;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%; 
      }

      table {
        border-collapse: separate;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        width: 100%; }
        table td {
          
          font-size: 14px;
          vertical-align: top; 
      }
          

      /* -------------------------------------
          BODY & CONTAINER
      ------------------------------------- */

      .body {
        background-color: #f6f6f6;
        width: 100%; 
      }

      /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
      .container {
        display: block;
        margin: 0 auto !important;
        /* makes it centered */
        max-width: 600px;
        padding: 10px;
        width: 600px; 
      }

      /* This should also be a block element, so that it will fill 100% of the .container */
      .content {
        box-sizing: border-box;
        display: block;
        margin: 0 auto;
        max-width: 600px;
        padding: 10px; 
      }

      /* -------------------------------------
          HEADER, FOOTER, MAIN
      ------------------------------------- */
      .main {
        background: #ffffff;
        width: 100%; 
        border-radius:10px;
      }

      .wrapper {
        box-sizing: border-box;
        padding: 20px; 
        border-bottom-left-radius:10px;
        border-bottom-right-radius:10px;
      }

      .content-block {
        padding-bottom: 10px;
        padding-top: 10px;
      }

      .footer {
        clear: both;
        margin-top: 10px;
        text-align: center;
        width: 100%; 
      }
        .footer td,
        .footer p,
        .footer span,
        .footer a {
          color: #999999;
          font-size: 12px;
          text-align: center; 
      }

      /* -------------------------------------
          TYPOGRAPHY
      ------------------------------------- */
      h1,
      h2,
      h3,
      h4 {
        color: #000000;
        
        font-weight: 400;
        line-height: 1.4;
        margin: 0;
        margin-bottom: 30px; 
      }

      h1 {
        font-size: 35px;
        font-weight: 300;
        text-align: center;
        text-transform: capitalize; 
      }

      p,
      ol {
        
        font-size: 18px;
        font-weight: normal;
        margin: 0;
        line-height:22px;
        margin-bottom: 15px; 
      }
        p li,
        ol li {
          list-style-position: inside;
          margin-left: 5px; 

      }

      a {
        color: #3498db;
        text-decoration: underline; 
      }

      /* -------------------------------------
          BUTTONS
      ------------------------------------- */
      .btn {
        box-sizing: border-box;
        width: 100%; }
        .btn > tbody > tr > td {
          padding-bottom: 15px; }
        .btn table {
          width: auto; 
      }
        .btn table td {
          background-color: #ffffff;
          border-radius: 5px;
          text-align: center; 
      }
        .btn a {
          background-color: #ffffff;
          border: solid 1px #3498db;
          border-radius: 5px;
          box-sizing: border-box;
          color: #3498db;
          cursor: pointer;
          display: inline-block;
          font-size: 14px;
          font-weight: bold;
          margin: 0;
          padding: 12px 25px;
          text-decoration: none;
      }

      .btn-primary table td {
        background-color: #3498db; 
      }

      .btn-primary a {
        background-color: #3498db;
        border-color: #3498db;
        color: #ffffff; 
      }

      /* -------------------------------------
          OTHER STYLES THAT MIGHT BE USEFUL
      ------------------------------------- */
      .last {
        margin-bottom: 0; 
      }

      .first {
        margin-top: 0; 
      }

      .align-center {
        text-align: center; 
      }

      .align-right {
        text-align: right; 
      }

      .align-left {
        text-align: left; 
      }

      .clear {
        clear: both; 
      }

      .mt0 {
        margin-top: 0; 
      }

      .mb0 {
        margin-bottom: 0; 
      }

      .preheader {
        color: transparent;
        display: none;
        height: 0;
        max-height: 0;
        max-width: 0;
        opacity: 0;
        overflow: hidden;
        mso-hide: all;
        visibility: hidden;
        width: 0; 
      }

      .powered-by a {
        text-decoration: none; 
      }

      hr {
        border: 0;
        border-bottom: 1px solid #f6f6f6;
        margin: 20px 0; 
      }
      /* -------------------------------------
          RESPONSIVE AND MOBILE FRIENDLY STYLES
      ------------------------------------- */
      @media only screen and (max-width: 620px) {
        table.body h1 {
          font-size: 28px !important;
          margin-bottom: 10px !important; 
        }
        table.body p,
        table.body ol,
        table.body td,
        table.body span,
        table.body a {
          font-size: 16px !important; 
        }
        table.body .wrapper,
        table.body .article {
          padding: 10px !important; 
        }
        table.body .content {
          padding: 0 !important; 
        }
        table.body .container {
          padding: 0 !important;
          width: 100% !important; 
        }
        table.body .main {
          border-left-width: 0 !important;
          border-radius: 0 !important;
          border-right-width: 0 !important; 
        }
        table.body .btn table {
          width: 100% !important; 
        }
        table.body .btn a {
          width: 100% !important; 
        }
        table.body .img-responsive {
          height: auto !important;
          max-width: 100% !important;
          width: auto !important; 
        }
      }

      /* -------------------------------------
          PRESERVE THESE STYLES IN THE HEAD
      ------------------------------------- */
      @media all {
        .ExternalClass {
          width: 100%; 
        }
        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
          line-height: 100%; 
        }
        .apple-link a {
          color: inherit !important;
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          text-decoration: none !important; 
        }
        #MessageViewBody a {
          color: inherit;
          text-decoration: none;
          font-size: inherit;
          font-family: inherit;
          font-weight: inherit;
          line-height: inherit;
        }
        .btn-primary table td:hover {
          background-color: #34495e !important; 
        }
        .btn-primary a:hover {
          background-color: #34495e !important;
          border-color: #34495e !important; 
        } 
      }
    </style>
  </head>
  <body>
    <span class="preheader">Novi pacijent</span>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
    
      <tr>
        <td>&nbsp;</td>
        <td class="container"> 
          
        <div class="content">
        <div style="background-image:url(cid:sentToLabHeader); height:145px; width:100%; padding:0; margin:0;  background-size:100%; border-top-left-radius:10px; border-top-right-radius:10px;  background-repeat: no-repeat;"></div>        
            <!-- START CENTERED WHITE CONTAINER -->
            
            <table role="presentation" class="main">
              <!-- START MAIN CONTENT AREA -->
              
              <tr>
                <td class="wrapper">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0"> 
                    <tr>
                      <td>
                        <h3 style="text-align:center; ">Laboratorija <span style="color:#1D88E5;"><a href="${req.get('referer')}" style="text-decoration:none;">${getLabData[0].labName}</a></span> Vas očekuje.</h3>
                        <p style="margin:0; padding:0;">${getLabData[0].address}, ${getLabData[0].placeId.place}</p>
                        <p>Telefoni: ${getLabData[0].phone}</p>
                        <table>
                          <tr>
                            <th>P</th>
                            <th>U</th>
                            <th>S</th>
                            <th>Č</th>
                            <th>P</th>
                            <th>S</th>
                            <th>N</th>
                          </tr>
                          <tr>
                          <td style="text-align:center;">${getLabData[0].workingHours.monday.opens}  ${getLabData[0].workingHours.monday.closes}</td>
                          <td style="text-align:center;">${getLabData[0].workingHours.tuesday.opens}  ${getLabData[0].workingHours.tuesday.closes}</td>
                          <td style="text-align:center;">${getLabData[0].workingHours.wednesday.opens}  ${getLabData[0].workingHours.wednesday.closes}</td>
                          <td style="text-align:center;">${getLabData[0].workingHours.thursday.opens}  ${getLabData[0].workingHours.thursday.closes}</td>
                          <td style="text-align:center;">${getLabData[0].workingHours.friday.opens}  ${getLabData[0].workingHours.friday.closes}</td>
                          <td style="text-align:center;">${getLabData[0].workingHours.saturday.opens}  ${getLabData[0].workingHours.saturday.closes}</td>
                          <td style="text-align:center;">${getLabData[0].workingHours.sunday.opens}  ${getLabData[0].workingHours.sunday.closes}</td>
                          </tr>  
                        </table>
                        <br />
                        
                        <h3>Odabrane analize</h3>
                        <ol style="font-size:18px;">${getBullets.join(' ')}</ol>
                        <h3>Ukupna cena : ${total} din.</h3>
                        <h3>Kod za besplatno tumacenje: ${discountCode}</h3>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                          <tbody>
                            <tr>
                              <td align="left">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                  <tbody>
                                    <tr>
                                      <td> <a href="https://labcube.rs" target="_blank">labcube.rs</a></td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <p></p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            <!-- END MAIN CONTENT AREA -->
            </table>
            <!-- END CENTERED WHITE CONTAINER -->

            <!-- START FOOTER -->
            <div class="footer" style="backgrond-color:red">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="content-block">
                    <span class="apple-link">Informacione tehnologije Nouvelle doo, 16. Oktobar 19, 11000 Beograd</span>
                  </td>
                </tr>
              </table>
            </div>
            <!-- END FOOTER -->
          </div>
        </td>
        
      </tr>
    </table>
  </body>
</html>
    `,
    attachments:[
      {
        filename: 'sentToLabHeader.png',
        path: 'src/images/sentToLabHeader.png',
        cid: 'sentToLabHeader'}
      ]
  }

  transporter.sendMail(sendEmailtoCustomer, (error, info) => {
    if(error) {
      return console.log(error)
  } else {
    console.log(info.messageId)
  }
})

  transporter.sendMail(mailOptionsSendInfo, (error, info) => {
      if(error) {
        return console.log(error)
    } else {
      console.log(info.messageId)
    }
  })
  //email end


  // console.log(total)
  // console.log(analysisArr)
//   let schedule = req.body[3].date.split('-')
// console.log(schedule)
// let test = new Date()
//   let newDate = new Date(schedule[2],schedule[1]-1,schedule[0])
//   newDate.setHours(test.getHours() + 2)

  // console.log(req.body[3].date)

// console.log(typeof(schedule))

  let newSchedule = new Schedule({
      // uzimanjeUzorka:uzimanjeUzorka,
      total:total,
      analyses:analysisArr,
      status:'Zakazano',
      user:req.user._id,
      lab:labId,
      scheduledFor:req.body[4].date,
      labCubePrice:req.body[2].labCubePrice,
      commentLab:comment,
      commentCube:commentCube,
      feedback:feedback,
      owner:owner
    })
    try {
      await newSchedule.save()
      res.redirect('/hvala',{user:req.user})
      
      }
    catch (e){
      req.flash('error_msg', `Dogodila se greška ${e}`)
      res.redirect('/')
    }
}

exports.updateSchedule = async (req,res) => {

  const updateSchedule = await Schedule.findOneAndUpdate(

    {_id:req.params.scheduleId},
    {status:req.body['status'+req.params.scheduleId],
    commentLab:req.body.komentar},
    {
      new:true,
      runValidators:true,
      useFindAndModify:false
    }).exec()
    req.flash('success_msg', 'Uspešno izmenjeni podaci o statusu')
    res.redirect('/profile/')
  // res.send(req.body['status'+req.params.scheduleId])
}

exports.thankyou = async (req,res) => {
  const groupNames = await Group.find({},{name:1,slug:1,_id:0}).sort({name:1})
  res.render('hvala',{user:req.user, groupNames, title:'LabCube | Hvala'})
}

exports.myResults = async (req,res) => {
  const myResults = await Schedule.findOne({_id:req.params.id})
  .populate('lab')
  .populate('user', 'username')
  .populate('analyses.analysisId')
  .populate('owner')
  res.render('myresults', {myResults, title:'LabCube | Moji rezultati'})
}

exports.userFeedback = async (req,res) => {
  const updateSchedule = await Schedule.findOneAndUpdate(
    {_id:req.body.scheduleId},
    {feedback:true},
    {
      new:true,
      runValidators:true,
      useFindAndModify:false
    }).exec()


  let newFeedback = new Feedback({
    lab:req.body.lab,
    hospitality:req.body.hospitality,
    venipuncture:req.body.venipuncture,
    speed:req.body.speed,
    covid:req.body.covid,
    comment:req.body.comment
  })
    try {
      await newFeedback.save()
      req.flash('success_msg', 'Uspesno ste ocenili laboratoriju, hvala!')
      res.redirect('/profile')
      }
    catch (e){
      req.flash('error_msg', `Dogodila se greška ${e}`)
      res.redirect('/')
    }
}

exports.resultsInterpretation = [authCheck, async (req,res) => {

  const countTotal = await Schedule.countDocuments({$or:[{status:'Završeno'},{status:'Uzorkovanje'}]})
  const page = req.params.page || 1
  const limit = 4
  const pages = Math.ceil(countTotal / limit)
  const skip = (page * limit) - limit

  const resultsForInterpretation = await Schedule.find({$or:[{status:'Završeno'},{status:'Uzorkovanje'}]})
    .skip(skip)
    .limit(limit)
    .populate('lab')
    .populate('user')
    .populate('analyses.analysisId')
    .populate('owner')
    .sort({createdDate:-1})
  res.render('resultsInterpretation', {resultsForInterpretation, title:'Tumačenje rezultata', page, countTotal, pages, paginationURL:'resultsInterpretation'})
}]

exports.otherResultsInterpretation = [authCheck, async (req,res) => {
  const countTotal = await Result.countDocuments({})
  const page = req.params.page || 1
  const limit = 10
  const pages = Math.ceil(countTotal / limit)
  const skip = (page * limit) - limit

  const otherResultsForInterpretation = await Result.find({})
    .skip(skip)
    .limit(limit)
    .populate('userId')
    .populate('owner')
    .sort({submitedDate:-1})
    res.render('otherResultsInterpretation', {otherResultsForInterpretation, title:'Tumačenje ostalih rezultata', page, countTotal, pages, paginationURL:'otherResultsInterpretation'})
}]



exports.uploadFile = [authCheck, (req,res) => {

  upload(req, res, (err) => {
    if(err) {
      req.flash('error_msg', 'Dozvoljeni formati fajlova su pdf, jepg, jpg, png i veličina fajla mora biti manja od 3MB')
      // res.redirect('/tumacenje-laboratorijskih-analiza')
    } else {
      const fileName = req.file.path
      let arrayToInsert = []
      csvtojson().fromFile(fileName).then(source => {
          // Fetching the all data from each row
          for (let i = 0; i < source.length; i++) {
              let oneRow = {
                analysis:source[i].analysis,
                analysisId:source[i].analysisId,
                value:source[i].value,
                measure:source[i].measure,
                lessThen:source[i].lessThen,
                greaterThen:source[i].greaterThen,
                valueFrom:source[i].valueFrom,
                valueTo:source[i].valueTo,
                outsideOfTheRange:source[i].outsideOfTheRange,
                commentResult:source[i].commentResult
              }
              arrayToInsert.push(oneRow)
           }
           try {
           let  updateOtherInterpretation =  Result.findOneAndUpdate(
            {_id:req.params.id},
            {$set:{
              analyses:arrayToInsert
              }
            },
            {
              new:true,
              runValidators:true,
              useFindAndModify:false
            }).exec()
            req.flash('success_msg','Uspešan upload')
            res.redirect(`/otherResultsInterpretation/${req.params.id}`)
            }
            catch {
              req.flash('error_msg', `Dogodila se greška ${e}`)
              res.redirect('/otherResultsInterpretation/${req.params.id}')
            }
            try{
             let sourceUrls = fileName;
             fs.unlinkSync(sourceUrls);
            } catch(err){
              console.log(err)
            }
         })
    }
  })
}]

exports.otherResultsInterpretationValues = [authCheck, async (req,res) => {

  const groupNames =  await Group.find({},{name:1,slug:1,_id:0}).sort({name:1})
  const findOtherResult = await Result.find({_id:req.params.id})
    .populate('userId')
  // const numberOfResults = await Result.find({userId:ObjectId(findOtherResult[0].userId._id)}).count()
  // const findPreviousResults =  await Result.find({userId:ObjectId(findOtherResult[0].userId._id)}).select({result:1, submitedDate:1}).limit(numberOfResults-1).sort({'submitedDate':1})
  const findPreviousResults =  await Result.find({userId:ObjectId(findOtherResult[0].userId._id)}).select({result:1, submitedDate:1}).sort({'submitedDate':1})

    // ObjectId()
    console.log(findPreviousResults)
    res.render('interpretatedOtherResults', {findOtherResult:findOtherResult, user:req.user, groupNames, findPreviousResults})
    // res.json(findOtherResult)

}]

exports.resultsInterpretationValues = [authCheck, async (req,res) => {
  const groupNames =  await Group.find({},{name:1,slug:1,_id:0}).sort({name:1})
  const analysisValues = await Schedule.find({_id:req.params.id})
  .populate('lab')
  .populate('user')
  res.render('analysisInterpretation', {analysisValues, user:req.user, groupNames})
}]

exports.analysisInterpretation = async (req,res) => {
// console.log(req.body['outsideOfTheRange'+req.body.analysisId[0]])

// let outsideOfTheRange = [] otkomentarisati ako se ukljucuje tumacenje svake analize
// let test = []
// let updateInterpretation


  // for (let i = 0; i<req.body.value.length; i++) { 
  //   if(req.body['outsideOfTheRange'+req.body.analysisId[i]] ==  undefined) {
  //     outsideOfTheRange = false
  //   } else {
  //     outsideOfTheRange = true
  //   }


  updateInterpretation = await Schedule.findOneAndUpdate(
    {_id:req.params.id, 'analyses.analysisId':req.body.analysisId[i]},
    {$set:{
      // 'analyses.$.value':req.body.value[i],
      // 'analyses.$.measure':req.body.measure[i],
      // 'analyses.$.commentResult':req.body.commentResult[i],
      // 'analyses.$.outsideOfTheRange':outsideOfTheRange,
      // 'analyses.$.lessThen':req.body.lessThen[i],
      // 'analyses.$.greaterThen':req.body.greaterThen[i],
      // 'analyses.$.valueFrom':req.body.valueFrom[i],
      // 'analyses.$.valueTo':req.body.valueTo[i],
      commentCube:req.body.commentCube
      }
    },
    {
      new:true,
      runValidators:true,
      useFindAndModify:false
    }).exec()
  // }
  res.send(updateInterpretation)
}


exports.analysisOtherInterpretation = async (req,res) => {
// console.log(req.body['outsideOfTheRange'+req.body.analysisId[0]])

let newDate = moment(new Date()).format("DD/MM/YYYY HH:mm")
// let test = []
let outsideOfTheRange
let updateInterpretation
let analysisArr = []
let oneAnalysis
let publish = (req.body.publish) ? 'Završeno' : 'pending'

if (Array.isArray(req.body.analysisName)) {
// OBAVEZNO PROVERITI
for (let i = 0; i < req.body.analysisName.length; i++) {
  if(req.body['outsideOfTheRange'+i]  ==  undefined )  {
    outsideOfTheRange = false
  } else {
    outsideOfTheRange = true
  }

  analysisArr.push({
  "analysis":req.body.analysisName[i],
  "analysisId":req.body.analysisId[i],
  "value":req.body.value[i],
  'measure':req.body.measure[i],
  'lessThen':req.body.lessThen[i] ? req.body.lessThen[i] : 0,
  'greaterThen':req.body.greaterThen[i] ? req.body.greaterThen[i] : 0,
  'valueFrom':req.body.valueFrom[i],
  'valueTo':req.body.valueTo[i],
  'commentResult':req.body.commentResult[i],
  'outsideOfTheRange':outsideOfTheRange})

  updateOtherInterpretation = await Result.findOneAndUpdate(
    {_id:req.params.id},
    {$set:{
      analyses:analysisArr,
      commentCube:req.body.commentCube,
      status:publish,
      readyForInterpreatation:req.body.readyForInterpreatation
      }
    },
    {
      new:true,
      runValidators:true,
      useFindAndModify:false
    }).exec()
}
} else {
  if(req.body['outsideOfTheRange'+0]  ==  undefined )  {
    outsideOfTheRange = false
  } else {
    outsideOfTheRange = true
  }
  analysisArr.push({
  "analysis":req.body.analysisName,
  "analysisId":req.body.analysisId,
  "value":req.body.value,
  'measure':req.body.measure,
  'lessThen':req.body.lessThen ? req.body.lessThen : 0,
  'greaterThen':req.body.greaterThen ? req.body.greaterThen : 0,
  'valueFrom':req.body.valueFrom,
  'valueTo':req.body.valueTo,
  'commentResult':req.body.commentResult,
  'outsideOfTheRange':outsideOfTheRange})
    updateOtherInterpretation = await Result.findOneAndUpdate(
    {_id:req.params.id},
    {$set:{
      analyses:analysisArr,
      commentCube:req.body.commentCube,
      status:publish,
      readyForInterpreatation:req.body.readyForInterpreatation
      }
    },
    {
      new:true,
      runValidators:true,
      useFindAndModify:false
    }).exec()
}
if (publish == 'Završeno') {
  req.flash('success_msg','Uspešno ste protumačili rezultate.')
  res.redirect('/otherResultsInterpretation/page/1')
} else {
  req.flash('success_msg','Uspešno ste sačuvali rezultate.')
  res.redirect('/otherResultsInterpretation/page/1')
}

  if(req.body.publish == 'Završeno') {
    let completedTime = await Result.findOneAndUpdate(
      {_id:req.params.id},
      {$set:{
        completedDate:Date.now()
        }
      },
      {
        new:true,
        runValidators:true,
        useFindAndModify:false
      }).exec()
// <div style="background-image:url(cid:headerEmailBig); width:100%; height:140px; background-size:100%;  background-repeat: no-repeat;"></div>
    let mailOptionsSendInfo = {
      from:'labcube-tumacenje-no-reply@labcube.rs',
      to:[req.body.email, 'tumacenje@labcube.rs'],
      // to:'culajevic@gmail.com',
      subject:'Protumačeni rezultati',
      text:'',
      html:`

      <div style="width:700px;  margin-left:auto; margin-right:auto; display:block; text-align:center; margin-top:0; padding-top:0; padding-bottom:0px; font-family:sans-serif; font-size:20px; margin-bottom:60px; border-bottom-left-radius: 20px; border-bottom-right-radius:20px; background-image:linear-gradient(315deg, #e1e1e1, #ffffff);">
      <div style="background-image:url(https://labcube.rs/images/headerBigEmail.png); width:100%; display:block; height:140px; background-size:100%; background-repeat: no-repeat;"></div>
        <div style="text-align:center;  color:#1D88E5;  padding-bottom:10px; padding-left:30px; padding-right:30px;"><h3>Vaši rezultati su protumačeni.</h3></div>
        <p style=""><a href="https://labcube.rs/myResult/${req.params.id}" style="text-decoration:none; background-color:#1D88E5; padding:20px; color:#fff; border-radius:5px;">pogledajte tumačenje</a></p>
        <div style="border-bottom:1px solid #E0E4EC; margin-top:40px;">
         <p style=" font-size:16px; opacity:0.6; line-height:24px; padding-bottom:30px; padding-left:30px; padding-right:30px;">Hvala što koristite naše usluge.</p>
        </div>
        <div style="text-align:center; margin-top:10px;  padding-left:30px; padding-right:30px;">
        <img style="width:30%; display-block;" src="cid:logoFooter" alt="labcube footer logo" title="labcube footer logo">
        </div>
        <a href="https://labcube.rs/politika-privatnosti" style="color:#9C9C9C; font-size:9px; display:inline;  opacity:0.6;  text-decoration:none;">politika privatnosti</a>
        <a href="https://labcube.rs/uslovi-koriscenja" style="color:#9C9C9C; font-size:9px; display:inline;  opacity:0.6;  text-decoration:none;">uslovi korišćenja</a>
         <p style="color:#9C9C9C; font-size:9px; padding-top:20px; opacity:0.6; padding-left:30px; padding-right:30px; padding-bottom:20px; text-decoration:none;">informacione tehnologije nouvelle d.o.o. 16. Oktobar 19, 11000 Beograd</p>
      </div>`,
      attachments:[
        {
          filename: 'logoFooter.png',
          path: 'src/images/logoFooter.png',
          cid: 'logoFooter'
        }]
    }
    transporter.sendMail(mailOptionsSendInfo, (error, info) => {
        if(error) {
          return console.log(error)
      } else {
        console.log(info.messageId)
      }
    })

  }
}


exports.lockTheInterpretation =  async (req,res) => {
  // console.log(req.body[0].ownerId)
  // console.log(req.body[0].interpretationId)

  let lockTheInterpretation = await Schedule.findOneAndUpdate(
    {_id:req.body[0].interpretationId},
    {owner:req.body[0].ownerId},
    {
      new:true,
      runValidators:true,
      useFindAndModify:false
    }).exec()
    res.send('ok je')
}

exports.lockTheOtherInterpretation =  async (req,res) => {
  // console.log(req.body[0].ownerId)
  // console.log(req.body[0].interpretationId)
  let check = await Result.find({$and:[ {_id:req.body[0].interpretationId},{owner:{$exists:true}}]}).countDocuments()
  console.log(check)
  if(check == 0) {
  let lockTheInterpretation = await Result.findOneAndUpdate(
    {_id:req.body[0].interpretationId},
    {owner:req.body[0].ownerId},
    {
      new:true,
      runValidators:true,
      useFindAndModify:false
    }).exec()
    res.send('ok je')
    console.log('zakljucano')
  }
  else {

    // console.log('vec je zakljucano')
    res.json('vec je zakljucano')
  }
}


exports.myResultLabCube = [authCheck, async (req,res) => {
  let feedbackSent
  const groupNames = await Group.find({},{name:1,slug:1,_id:0}).sort({name:1})
  const myResults = await Result.findOne({$and:[{_id:req.params.id},{status:'Završeno'}]})
  .populate('analyses.analysisId', 'analysesName, shortDesc')
  .populate('owner', 'username aboutUser image')

  if (myResults.star != undefined || myResults.userFeedback != undefined) {
    feedbackSent = 1
  } else {
    feedbackSent = 0
  }

  res.render('myResultsLabCube', {myResults, groupNames, feedbackSent, user:req.user, title:'LabCube | Moji rezultati'})
}]
