const dotenv = require('dotenv')
const mongoose = require('mongoose')
const moment = require('moment')
const Analysis = mongoose.model('Analysis')
const Price = mongoose.model('Price')
const ObjectId = mongoose.Types.ObjectId
const Result = mongoose.model('Result')
const Group = mongoose.model('Group')
const multer = require('multer')
const mime = require('mime-types')
const nodemailer = require('nodemailer')
moment.locale('sr')

////////////////////////////////////////////////
const https = require('https')              //
const querystring = require('querystring') //
////////////////////////////////////////////


dotenv.config({path:'variables.env'})

//send email with verification code
// let transporter = nodemailer.createTransport({
//   host:'smtp.gmail.com',
//   service:'gmail',
//   port:464,
//   auth: {
//       type: "OAUTH2",
//       user: "labcubee@gmail.com",
//       clientId: process.env.CLIENTID,
//       clientSecret: process.env.CLIENTSECRET,
//       refreshToken: process.env.REFRESHTOKEN,
//       accessToken:process.env.ACCESSTOKEN
//   }
// })

let transporter = nodemailer.createTransport({
  host:'mail.labcube.rs',
  port:465,
  secure:true,
  auth: {
      user:"potrebno-tumacenje@labcube.rs",
      pass:process.env.EMAILPASS
  },
  tls: {
        rejectUnauthorized: false
    }
})

//upload results
let storage = multer.diskStorage({
  destination:function (req,file,cb) {
    cb(null, 'src/results')
  },
  filename: function (req,file,cb)  {
    const fileExtension = mime.extension(file.mimetype)
    cb(null, `${file.originalname}-${Date.now()}.${fileExtension}`)
  }
})

const upload = multer({
    storage:storage,
    limits:{fileSize:1024*1024*3,fieldSize: 1024 * 512,fieldNameSize: 200},
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
      }
      else {
        cb(new multer.MulterError('something went wrong, probably Vucic knows what happened'));
      }
    }
  }).single('result')

  exports.upload =  (req,res, next) => {
    upload(req, res, (err) => {
      if(err) {
        req.flash('error_msg', 'Dozvoljeni formati fajlova su pdf, jepg, jpg, png i veličina fajla mora biti manja od 3MB')
        // res.redirect('/tumacenje-laboratorijskih-analiza')
      } else {
        next()
      }
    })
  }


exports.payment = async (req,res) => {
  // let datum = new Date()

    const groupNames =  await Group.find({},{name:1,slug:1,_id:0}).sort({name:1})
  // placanje testing
  let currentId
  let resultUpload
  let errors = []

  if(!req.body.email) {
    errors.push({text:'Obavezno je uneti email adresu'})
  }

  if(!req.body.package) {
    errors.push({text:'Obavezno je odabrati vreme za koje želite da Vam se protumači rezultat'})
  }

  if(!req.file) {
    errors.push({text:'Nedostaju rezultati koje želite da Vam protumačimo'})
  }

  if(!req.body.consent) {
    errors.push({text:'Potvrdite da ste saglasni sa uslovima plaćanja'})
  }


  if(errors.length > 0) {
    res.render('labResultsAnalysis', {
      errors,
      package:req.body.package,
      email:req.body.email,
      user:req.user,
      consent:req.body.consent
    })
    return false
  }
  // else {
    // if(req.file) {

      // let deadline = new Date()
        // deadline.setHours(deadline.getHours() + parseInt(req.body.package))
    // } else {
    //   req.flash('error_msg', 'doslo je do greske prilikom uploada')
    // }

    // resultUpload =  new Result(req.body)
    // currentId = resultUpload._id


  // }
//
  const request = async() => {
  	const path='/v1/checkouts';
  	const data = querystring.stringify({
  		'entityId':'8ac7a4c77a0d2dd7017a0f4d02c30b47',
  		'amount':req.body.package,
      'customer.email':req.body.email,
  		'currency':'RSD',
      'customer.merchantCustomerId':req.body.userId,
      'customParameters[SHOPPER_file]':req.file.filename,
      'customParameters[SHOPPER_path]':req.file.path,
  		'paymentType':'DB'
  	});
  	const options = {
  		port: 443,
  		host: 'test.oppwa.com',
  		path: path,
  		method: 'POST',
  		headers: {
  			'Content-Type': 'application/x-www-form-urlencoded',
  			'Content-Length': data.length,
  			'Authorization':'Bearer OGFjN2E0Yzc3YTBkMmRkNzAxN2EwZjRiYWYwYTBiNDN8Qjl4U2o2NkRNeA=='
  		}
  	};
  	return new Promise((resolve, reject) => {
  		const postRequest = https.request(options, function(res) {
  			const buf = [];
  			res.on('data', chunk => {
  				buf.push(Buffer.from(chunk));
  			});
  			res.on('end', () => {
  				const jsonString = Buffer.concat(buf).toString('utf8');
  				try {
  					resolve(JSON.parse(jsonString));
  				} catch (error) {
  					reject(error);
  				}
  			});
  		});
  		postRequest.on('error', reject);
  		postRequest.write(data);
  		postRequest.end();
  	})
  }
request()
    .then(data => {
      console.log(data)
      if(data.result.code == '000.200.100') {
        res.render('paymentPage', {data:data.id, recordId:currentId, userId:req.body.userId, email:req.body.email, resultFile:req.file.filename, package:req.body.package, user:req.user, groupNames})
      }
    })
    .catch(error => {
      console.log(error)
    })
  //placanje test end
}



exports.paymentDone = async (req,res) => {
  const groupNames =  await Group.find({},{name:1,slug:1,_id:0}).sort({name:1})
  const requestCheckout = async () => {
  	var path=`${req.query.resourcePath}`
  	path += '?entityId=8ac7a4c77a0d2dd7017a0f4d02c30b47';
  	const options = {
  		port: 443,
  		host: 'test.oppwa.com',
  		path: path,
  		method: 'GET',
  		headers: {
  			'Authorization':'Bearer OGFjN2E0Yzc3YTBkMmRkNzAxN2EwZjRiYWYwYTBiNDN8Qjl4U2o2NkRNeA=='
  		}
  	};
  	return new Promise((resolve, reject) => {
  		const postRequest = https.request(options, function(res) {
  			const buf = [];
  			res.on('data', chunk => {
  				buf.push(Buffer.from(chunk));
  			});
  			res.on('end', () => {
  				const jsonString = Buffer.concat(buf).toString('utf8');
  				try {
  					resolve(JSON.parse(jsonString));
  				} catch (error) {
  					reject(error);
  				}
  			});
  		});
  		postRequest.on('error', reject);
  		postRequest.end();
  	});
  };

requestCheckout()
.then(data => {
  console.log(data)
  if(data.result.code == '000.100.110') {
    let newDate = moment(new Date()).format("DD/MM/YYYY HH:mm")

    // const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // let bgLocalTime = new Date().toLocaleString('sr-RS')
    console.log(newDate)
    let deadline = new Date()
    let serviceClosingTime = new Date()
    let ofHours
    let tomorrow = new Date()
    serviceClosingTime.setHours(17,0,0)


  let minRest =Math.abs(Math.floor(serviceClosingTime.getTime() - deadline.getTime()) / (1000*60))
  let hourRest = Math.abs(Math.ceil(serviceClosingTime.getTime() - deadline.getTime()) / (1000*60*60))



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //paket sat vremena
      if (deadline.getHours() > 9 && deadline.getHours() < 16 && data.amount == 999) {
        deadline.setHours(deadline.getHours() + 1)
      } else if(deadline.getHours() > 0 && deadline.getHours() < 9 && data.amount == 999) {
        // tomorrow.setDate(tomorrow.getDate() + 1)
        // tomorrow.setHours(9,0,0)
        deadline.setHours(9,0,0)
        deadline = tomorrow.setHours(deadline.getHours() + 1)
      } else if (deadline.getHours() >= 16 && deadline.getHours() < 17) {
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(9,0,0)
        deadline = tomorrow.setHours(tomorrow.getHours() + 1)
        deadline = tomorrow.setMinutes(tomorrow.getMinutes() - minRest)
      } else if (data.amount == 999) {
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(9,0,0)
        deadline = tomorrow.setHours(tomorrow.getHours() + 1)
        // paket 4 sata
      }  else if (deadline.getHours() > 9 && deadline.getHours() < 13 && data.amount == 699) {
          deadline.setHours(deadline.getHours() + 4)
        } else if(deadline.getHours() > 0 && deadline.getHours() < 9 && data.amount == 699) {
          deadline.setHours(9,0,0)
          deadline = tomorrow.setHours(deadline.getHours() + 4)
        } else if (deadline.getHours() >= 13 && deadline.getHours() < 17) {
          tomorrow.setDate(tomorrow.getDate() + 1)
          tomorrow.setHours(9,0,0)
          deadline = tomorrow.setHours(tomorrow.getHours() + 4)
          deadline = tomorrow.setMinutes(tomorrow.getMinutes() - minRest)
        } else if (data.amount == 699) {
          tomorrow.setDate(tomorrow.getDate() + 1)
          tomorrow.setHours(9,0,0)
          deadline = tomorrow.setHours(tomorrow.getHours() + 4)
        }


      // else if ((deadline.getHours() > 8 && deadline.getHours() < 13) && data.amount == 699) {
      //   console.log(3)
      //       deadline.setHours(deadline.getHours() + 4)
      //     } else if (data.amount == 699) {
      //       console.log(4)
      //       tomorrow.setDate(tomorrow.getDate() + 1)
      //       tomorrow.setHours(9,0,0)
      //       deadline = tomorrow.setHours(tomorrow.getHours() + 4)
      //     }

      // if ((deadline.getHours() > 8 && deadline.getHours() < 13) && data.amount == 699) {
      //   deadline.setHours(deadline.getHours() + 4)
      //         console.log(3)
      // } else if(data.amount == 699) {
      //         console.log(4)
      //   tomorrow.setDate(tomorrow.getDate() + 1)
      //   tomorrow.setHours(9,0,0)
      //   deadline = tomorrow.setHours(tomorrow.getHours() + 4)
      // }

      // if (deadline.getHours() > 13 && deadline.getHours() < 0 && data.amount == 699) {
      //   deadline.setHours(deadline.getHours() + 4)
      // } else if(data.amount == 699) {
      //   tomorrow.setDate(tomorrow.getDate() + 1)
      //   tomorrow.setHours(9,0,0)
      //   deadline = tomorrow.setHours(tomorrow.getHours() + 4)
      // }
      //


    // if (data.amount == 999 && ofHours) {
    //     deadline = tomorrow.setHours(tomorrow.getHours() + 1)
    //
    //   }  else {
    //     deadline.setHours(deadline.getHours() + 1)
    //
    //     }

    //  if (data.amount == 699 && (deadline.getHours() > 13 || deadline.getHours() < 9)) {
    //   deadline = tomorrow.setHours(tomorrow.getHours() + 4)
    // } else {
    //     deadline.setHours(deadline.getHours() + 4)
    // }
    //
    // if (data.amount == 499 && (deadline.getHours() > 16 || deadline.getHours() < 9)) {
    //   deadline = tomorrow.setHours(tomorrow.getHours() + 12)
    // } else {
    //   deadline.setHours(deadline.getHours() + 12)
    // }
    //
    // if (data.amount == 399 && (deadline.getHours() > 16 || deadline.getHours() < 9)) {
    //   deadline = tomorrow.setHours(tomorrow.getHours() + 24)
    // } else {
    //   deadline.setHours(deadline.getHours() + 24)
    // }


    // let updatePaymentInfo = Result.findOneAndUpdate(
    //   {_id:data.customParameters.SHOPPER_requestId},
    //   {paid:data.amount, ip:data.customer.ip},
    //   {
    //     new:true,
    //     runValidators:true,
    //     useFindAndModify:false
    //   }).exec()

    const uploadResult = new Result({
      userId:data.customer.merchantCustomerId,
      email:data.customer.email,
      status:'pending',
      result:data.customParameters.SHOPPER_file,
      package:data.amount,
      paid:data.amount,
      ip:data.customer.ip,
      submitedDate: Date.now(),
      deadline:deadline,
      paymentConsent:true
      }
    )
    let currentId = uploadResult._id

    let shortId = String(currentId)
    shortId.substring(14,2)
       try {
         uploadResult.save()
         let mailOptions = {
           from:data.customer.email,
           to:'tumacenje@labcube.rs',
           subject:'Novi rezultati za tumačenje',
           text:'',
           html:`
           id: ${uploadResult._id}`,
           attachments:[{
             filename:data.customParameters.SHOPPER_file,
             path:data.customParameters.SHOPPER_path
           }]
         }

         let userFirstName = req.user.username.split(' ')

         let mailOptionsCustomer = {
           from:'labcube-tumacenje-no-reply@labcube.rs',
           to:data.customer.email,
           subject:'Tumačenje laboratorijskih analiza',
           text:'',
           html:`
           <img src="cid:headerEmailBig">
           <div style="width:80%; margin:0 auto; text-align:center">
           <div style="text-align:center; font-family:sans-serif; color:#1D88E5; margin-top:30px; margin-bottom:20px;"><h1>${userFirstName[0]}, uspešno ste izvršili uplatu.</h1><h1>Hvala</h1></div>
           <div style="text-align:center; font-family:sans-serif; font-size:20px; opacity:0.6; padding:20px;">
           <p>Tumačenje u roku od 24h</p>
           <p>broj fakture: ${currentId}</p>
           <p>plaćeno: ${data.amount} RSD</p>
           <p>${newDate}</p>
           </div>
           <div style="border-bottom:1px solid #E0E4EC;"><p style="font-family:sans-serif; font-size:16px; opacity:0.6; line-height:24px; padding-bottom:30px;">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p></div>
           <div style="text-align:center;">
           <img style="margin-top:30px; padding-top:30px; padding-bottom:20px;" src="cid:logoFooter">
           </div>
           <small style="color:#E0E4EC; text-decoration:none;">informacione tehnologije nouvelle doo </small>
           </div>`,
           attachments:[{
             filename: 'headerEmailBig.svg',
             path: 'src/images/headerEmailBig.svg',
             cid: 'headerEmailBig'},
             {
               filename: 'logoFooter.svg',
               path: 'src/images/logoFooter.svg',
               cid: 'logoFooter'
             }]
         }

         transporter.sendMail(mailOptions, (error, info) => {
             if(error) {
               return console.log(error)
           } else {
             console.log(info.messageId)
           }
         })

         transporter.sendMail(mailOptionsCustomer, (error, info) => {
             if(error) {
               return console.log(error)
           } else {
             console.log(info.messageId)
           }
         })
         // req.flash('success_msg','Vaši rezultati su uspešno prosleđeni na tumačenje')
         // res.redirect('/')

         }
       catch (e) {
         // req.flash('error_msg', `Dogodila se greška prilikom slanja rezultata ${e}`)
         // res.redirect('/tumacenje-laboratorijskih-analiza')
         console.log(e);
       }
       res.render('paymentSuccess', {data:data, groupNames, shortId})
     }
   })
.catch(console.error);

}

exports.labResult = async (req,res) => {

  // let errors = []
  // if(!req.body.email) {
  //   errors.push({text:'Obavezno je uneti email adresu'})
  // }
  //
  // if(!req.body.package) {
  //   errors.push({text:'Obavezno je odabrati vreme za koje želiš da ti se protumači rezultat'})
  // }
  //
  // if(!req.file) {
  //   errors.push({text:'Nedostaju rezultati koje želiš da ti protumačimo'})
  // }
  // if(errors.length > 0) {
  //   res.render('labResultsAnalysis', {
  //     errors,
  //     package:req.body.package,
  //     email:req.body.email,
  //     user:req.user
  //   })
  // } else {
  //   if(req.file) {
  //     req.body.result = req.file.filename
  //     req.body.submitedDate = Date.now()
  //     req.body.owner = ''
  //     let deadline = new Date()
  //       deadline.setHours(deadline.getHours() + parseInt(req.body.package))
  //     req.body.deadline = deadline
  //   } else {
  //     req.flash('error_msg', 'doslo je do greske prilikom uploada')
  //   }
  //
  //   const resultUpload = new Result(req.body)
  //   try {
  //     await resultUpload.save()
  //     let mailOptions = {
  //       from:'labcubee@gmail.com',
  //       to:'culajevic@gmail.com',
  //       subject:'lab results',
  //       text:'',
  //       html:`${req.body.email} i ${req.body.package}`,
  //       attachments:[{
  //         filename:req.file.filename,
  //         path:req.file.path
  //       }]
  //
  //     }
  //     transporter.sendMail(mailOptions, (error, info) => {
  //         if(error) {
  //           return console.log(error)
  //       } else {
  //         console.log('message sent', info.messageId)
  //       }
  //       })
  //     req.flash('success_msg','Vaši rezultati su uspešno prosleđeni na tumačenje')
  //     res.redirect('/')
  //     }
  //   catch (e) {
  //     req.flash('error_msg', `Dogodila se greška prilikom slanja rezultata ${e}`)
  //     res.redirect('/tumacenje-laboratorijskih-analiza')
  //   }
  // }
}



exports.displayResults = async (req,res) => {
  const groupNames = await Group.find({},{name:1,slug:1,_id:0}).sort({name:1})
  res.render('results',{
    sidebarNav:false,
    groupNames,
    user:req.user,
    title:'Labcube - Pretraga'
  })
}

exports.displayAnalysisDetails = async (req,res) => {
  let analysisDetails = await Analysis.findOne({slug:req.params.slug})
  .populate('connectedTo', 'analysisName abbr slug')
  .populate('references')
  .populate('writtenBy')
  .populate('groupId', 'iconPath')

  const groupNames = await Group.find({},{name:1,slug:1,_id:0}).sort({name:1})
  // let title = analysisDetails.analysisName

  const prices = await Price.aggregate([
  {$unwind:'$cenovnik'},
  {$match:{'cenovnik.analiza':ObjectId(analysisDetails._id)}},
  {$group: {_id:'$cenovnik.analiza', minPrice:{$min:'$cenovnik.cena'}, maxPrice:{$max:'$cenovnik.cena'}}},
  {$project:{minPrice:1,
            maxPrice:1}}
])
  res.render('details',{analysisDetails, prices, sidebarNav:true, user:req.user, groupNames, title:analysisDetails.analysisName, metaDescription:analysisDetails.shortDesc, metaKeywords:analysisDetails.alt})
}

exports.labRestultsAnalysis = async (req,res) => {
  let groupNames = await Group.find({},{name:1,slug:1,_id:0}).sort({name:1})
  res.render('labResultsAnalysis', {user:req.user, groupNames, title:'Labcube - Tumačenje laboratorijskih analiza'})
}
