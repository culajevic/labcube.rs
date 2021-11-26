const dotenv = require('dotenv')
const mongoose = require('mongoose')
const moment = require('moment')
const Analysis = mongoose.model('Analysis')
const Price = mongoose.model('Price')
const ObjectId = mongoose.Types.ObjectId
const Result = mongoose.model('Result')
const Group = mongoose.model('Group')
const Payment = mongoose.model('Payment')
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
  // secure:true,
  auth: {
      user:"labcube-tumacenje-no-reply@labcube.rs",
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
        cb(new multer.MulterError('dogodila se greška prilikom uploada'));
      }
    }
  }).single('result')

exports.upload =  (req,res, next) => {
    upload(req, res, (err) => {
      if(err) {
        req.flash('error_msg', 'Dozvoljeni formati fajlova su pdf, jepg, jpg, png i veličina fajla mora biti manja od 3MB')
        res.redirect('/tumacenje-laboratorijskih-analiza')
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


//ako se menja cena mora se promeniti i ovo
  if(req.body.package != 890) {
    errors.push({text:'Nije ok'})
  }

  // if(!req.body.package) {
  //   errors.push({text:'Obavezno je odabrati vreme za koje želite da Vam se protumači rezultat'})
  // }

  if(!req.file) {
    errors.push({text:'Nedostaju rezultati koje želite da Vam protumačimo'})
  }

  if(!req.body.consent) {
    errors.push({text:'Potvrdite da ste saglasni sa uslovima plaćanja'})
  }


  if(errors.length > 0) {
    res.render('labResultsAnalysis', {
      errors,
      title:'LabCube | Tumačenje laboratorijskih analiza',
      groupNames,
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
  		'entityId':process.env.ENTITYIDPRODUCTION,
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
  		host: process.env.PAYMENTHOSTPRODUCTION,
  		path: path,
  		method: 'POST',
  		headers: {
  			'Content-Type': 'application/x-www-form-urlencoded',
  			'Content-Length': data.length,
  			'Authorization':process.env.ACCESSTOKENPAYMENTPRODUCTION
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
        res.render('paymentPage', {data:data.id, recordId:currentId, userId:req.body.userId, email:req.body.email, resultFile:req.file.filename, package:req.body.package, user:req.user, groupNames, title:'Labcube | Potvrdite plaćanje usluge'})
      }
    })
    .catch(error => {
      console.log(error)
    })
}



exports.paymentDone = async (req,res) => {
  const groupNames =  await Group.find({},{name:1,slug:1,_id:0}).sort({name:1})
  console.log(req.query.resourcePath)
  const requestCheckout = async () => {
  	var path =`${req.query.resourcePath}`
  	// path += '?entityId='+process.env.ENTITYIDSANDBOX;
  	path += '?entityId='+process.env.ENTITYIDPRODUCTION;
  	const options = {
  		port: 443,
  		host: process.env.PAYMENTHOSTPRODUCTION,
  		path: path,
  		method: 'GET',
  		headers: {
  			'Authorization':process.env.ACCESSTOKENPAYMENTPRODUCTION
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
  if(data.result.code == '000.000.000') {
    //000.100.110
    let newDate = moment(new Date()).format("DD/MM/YYYY HH:mm")

    // const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // let bgLocalTime = new Date().toLocaleString('sr-RS')
    // console.log(newDate)
    let deadline = new Date()
    deadline.setDate(deadline.getDate() + 1)
    let serviceClosingTime = new Date()
    let ofHours
    let tomorrow = new Date()
    serviceClosingTime.setHours(17,0,0)

  let minRest =Math.abs(Math.floor(serviceClosingTime.getTime() - deadline.getTime()) / (1000*60))
  let hourRest = Math.abs(Math.ceil(serviceClosingTime.getTime() - deadline.getTime()) / (1000*60*60))





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //paket sat vremena / postavljanej dedline na osnovu odabranog paketa i vremena kada je submitovan zahtev

      // if (deadline.getHours() > 9 && deadline.getHours() < 16 && data.amount == 999) {
      //   deadline.setHours(deadline.getHours() + 1)
      // } else if(deadline.getHours() > 0 && deadline.getHours() < 9 && data.amount == 999) {
      //   // tomorrow.setDate(tomorrow.getDate() + 1)
      //   // tomorrow.setHours(9,0,0)
      //   deadline.setHours(9,0,0)
      //   deadline = tomorrow.setHours(deadline.getHours() + 1)
      // } else if (deadline.getHours() >= 16 && deadline.getHours() < 17) {
      //   tomorrow.setDate(tomorrow.getDate() + 1)
      //   tomorrow.setHours(9,0,0)
      //   deadline = tomorrow.setHours(tomorrow.getHours() + 1)
      //   deadline = tomorrow.setMinutes(tomorrow.getMinutes() - minRest)
      // } else if (data.amount == 999) {
      //   tomorrow.setDate(tomorrow.getDate() + 1)
      //   tomorrow.setHours(9,0,0)
      //   deadline = tomorrow.setHours(tomorrow.getHours() + 1)
      //   // paket 4 sata
      // }  else if (deadline.getHours() > 9 && deadline.getHours() < 13 && data.amount == 699) {
      //     deadline.setHours(deadline.getHours() + 4)
      //   } else if(deadline.getHours() > 0 && deadline.getHours() < 9 && data.amount == 699) {
      //     deadline.setHours(9,0,0)
      //     deadline = tomorrow.setHours(deadline.getHours() + 4)
      //   } else if (deadline.getHours() >= 13 && deadline.getHours() < 17) {
      //     tomorrow.setDate(tomorrow.getDate() + 1)
      //     tomorrow.setHours(9,0,0)
      //     deadline = tomorrow.setHours(tomorrow.getHours() + 4)
      //     deadline = tomorrow.setMinutes(tomorrow.getMinutes() - minRest)
      //   } else if (data.amount == 699) {
      //     tomorrow.setDate(tomorrow.getDate() + 1)
      //     tomorrow.setHours(9,0,0)
      //     deadline = tomorrow.setHours(tomorrow.getHours() + 4)
      //   }


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

    const paymentLog = new Payment({
      ip:data.customer.ip,
      email:data.customer.email,
      amount:data.amount,
      cardHolder:data.card.holder,
      address:data.billing.street1,
      postalCode:data.billing.postcode,
      city:data.billing.city,
      paymentCode:data.result.code,
      paymentDesc:data.result.description,
      idSuccess:currentId
    }).save()

    let authCode = data.resultDetails.ConnectorTxID3
    let authCodeParameter = authCode.substring(0,6)

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


         // let userFirstName = req.user.username.split(' ')

         let mailOptionsCustomer = {
           from:'labcube-tumacenje-no-reply@labcube.rs',
           to:[data.customer.email, 'racuni@labcube.rs'],
           subject:'Uspešno izvršena uplata za tumačenje laboratorijskih rezultata',
           text:'',
           html:`

           <div style="width:700px;  margin-left:auto; margin-right:auto; display:block; text-align:center; margin-top:0; padding-top:0; padding-bottom:30px; font-family:sans-serif; font-size:20px; margin-bottom:60px; border-bottom-left-radius: 20px; border-bottom-right-radius:20px; background-image:linear-gradient(315deg, #e1e1e1, #ffffff);">
           <div style="background-image:url(cid:headerEmailBig); width:100%; height:140px; background-size:100%;  background-repeat: no-repeat;"></div>
            <div style="text-align:right; font-family:sans-serif;  padding-bottom:10px; padding-left:30px; padding-right:30px;">
              <p style="opacity:0.6; font-size:14px; padding-left:30px; padding-right:30px; margin-top:0; padding-top:40px;" >br. računa: ${currentId}</p>
              <p style="opacity:0.6; font-size:14px; padding-left:30px; padding-right:30px; margin-top:-10px; padding-top:0;" >${data.card.holder}</p>
              <p style="opacity:0.6; font-size:14px; padding-left:30px; padding-right:30px; margin-top:-10px; padding-top:0;" >${data.billing.street1}</p>
              <p style="opacity:0.6; font-size:14px; padding-left:30px; padding-right:30px; margin-top:-10px; padding-top:0;" >${data.billing.city}</p>
            </div>
           <div style="text-align:center; font-family:sans-serif; color:#1D88E5;  padding-bottom:10px; padding-left:30px; padding-right:30px;"><h2>Uspešno izvršena uplata. Hvala!</h2></div>

             <p style="opacity:0.6; font-size:17px; padding-left:30px; padding-right:30px;" >&#8987; Tumačenje u roku od 24h</p>
             <p style="opacity:0.6; font-size:17px; padding-left:30px; padding-right:30px;" >&#128196 Autorizacioni kod banke: ${authCodeParameter}</p>
             <p style="opacity:0.6; font-size:17px; padding-left:30px; padding-right:30px;" >&#128179; ${data.paymentBrand} **** **** **** ${data.card.last4Digits}</p>
             <p style="opacity:0.6; font-size:17px; padding-left:30px; padding-right:30px;" >&#128178; ${data.amount} RSD</p>
             <p style="opacity:0.6; font-size:17px; padding-left:30px; padding-right:30px;" >&#9200; ${newDate}</p>

             <div style="border-bottom:1px solid #E0E4EC; margin-top:40px;">
              <p style="font-family:sans-serif; font-size:16px; opacity:0.6; line-height:24px; padding-bottom:30px; padding-left:30px; padding-right:30px;">Primili smo Vaše rezultate. Dok čekate tumačenje rezultata predlažemo Vam da popunite zdravstveni upitnik ukoliko to već niste uradili. Popunjavanje <a href="https://labcube.rs/profile" target="_blank" style="text-decoration:none;">ovog kratkog upitnika</a> nam pomaže da bolje razumemo Vaše trenutno zdravstveno stanje. Svi podaci koje podelite sa nama se smatraju strogo poverljivim i koriste se isključivo u svrhu tumačenja rezultata. U svakom trenutku možete obrisati sve podatke iz Vašeg zdravstvenog profila. Ukoliko Vas interesuje kako brinemo o Vašim podacima pročitaje našu  <a href="https://labcube.rs/politika-privatnosti" style="display:inline;  opacity:0.6;  text-decoration:none;">politiku privatnosti</a></p>
             </div>
             <div style="text-align:center; margin-top:40px;  padding-left:30px; padding-right:30px;">
             <img style="width:30%; display-block;" src="cid:logoFooter" alt="labcube footer logo" title="labcube footer logo">
             </div>
             <a href="https://labcube.rs/politika-privatnosti" style="color:#9C9C9C; font-size:9px; display:inline;  opacity:0.6;  text-decoration:none;">politika privatnosti</a>
             <a href="https://labcube.rs/uslovi-koriscenja" style="color:#9C9C9C; font-size:9px; display:inline;  opacity:0.6;  text-decoration:none;">uslovi korišćenja</a>
              <p style="color:#9C9C9C; font-size:9px; padding-bottom:0; opacity:0.6; padding-left:30px; padding-right:30px; text-decoration:none;">Informacione tehnologije Nouvelle d.o.o. 16. Oktobar 19, 11000 Beograd / PIB 106310784</p>
           </div>`,
           attachments:[{
             filename: 'headerBigEmail.png',
             path: 'src/images/headerBigEmail.png',
             cid: 'headerEmailBig'},
             {
               filename: 'logoFooter.png',
               path: 'src/images/logoFooter.png',
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
       catch  (e){
         // req.flash('error_msg', `Dogodila se greška prilikom slanja rezultata ${e}`)
         // res.redirect('/tumacenje-laboratorijskih-analiza')
         console.log('nije uspesno upisano u bazu' + e)
       }
       res.render('paymentSuccess', {data:data, newDate, amount:data.amount, groupNames, authCodeParameter, shortId, user:req.user, title:'LabCube | Uspešno ste izvršili uplatu'})
     }
     else {

       let secureError = /^(800\.400\.2|100\.380\.4|100\.390)/
       let externalBankError = /^(800\.[17]00|800\.800\.[123])/
       let riskSystemError = /^(100\.400\.[0-3]|100\.38|100\.370\.100|100\.370\.11)/
       let blackListError = /^(100\.100\.701|800\.[32])/
       let errorPayment

       switch(true) {
         case externalBankError.test(data.result.code):
          errorPayment = 'Banka je odbila transakciju, proverite da li imate dovoljno sredstava na kartici kao i da li Vaša kartica podržava plaćanje preko interneta.'
          break;
         case secureError.test(data.result.code):
          errorPayment = 'Transakcija je odbijena zbog tehničke greške u 3D Secure sistemu.'
          break;
         case riskSystemError.test(data.result.code):
          errorPayment = 'Banka nije u mogućnosti da autentifikuje korisnika, proverite da li ste ispravno uneli jednokratnu lozinku.'
          break;
         case blackListError.test(data.result.code):
          errorPayment = 'Banka je odbila transakciju jer se kartica nalazi na crnoj listi.'
          break;
        default:
          errorPayment = data.result.description
       }

        const paymentLog = new Payment({
          ip:data.customer.ip,
          email:data.customer.email,
          amount:0,
          cardHolder:data.card.holder,
          address:data.billing.street1,
          postalCode:data.billing.postcode,
          city:data.billing.city,
          paymentCode:data.result.code,
          paymentDesc:data.result.description
        }).save()
       let mailOptionsCustomerError = {
         from:'labcube-tumacenje-no-reply@labcube.rs',
         to:data.customer.email,
         // to:'culajevic@gmail.com',
         subject:'Neuspešna transakcija',
         text:'',
         html:`

         <div style="width:700px; margin:0 auto; text-align:center; margin-top:0; padding-top:0; padding-bottom:10px; font-family:sans-serif; font-size:20px; margin-bottom:60px; border-bottom-left-radius: 20px; border-bottom-right-radius:20px; background-image:linear-gradient(315deg, #e1e1e1, #ffffff);"">
         <div style="background-image:url(cid:headerEmailBig); width:100%; height:140px; background-size:100%;  background-repeat: no-repeat;"></div>
         <div style="text-align:center; font-family:sans-serif; color:#FF6F6F; padding-left:30px; padding-right:30px; padding-bottom:10px;"><h3>Transakcija nije izvršena!<br /> ${errorPayment}</h3></div>
           <div style="text-align:center; margin-top:10px;  border-top:1px solid #E0E4EC; padding-left:30px; padding-right:30px;">
           <img style="width:30%; display-block; width:120px; padding-top:20px;" src="cid:logoFooter" alt="labcube footer logo" title="labcube footer logo">
           <p style="color:#9C9C9C; font-size:9px; padding-top:0px; opacity:0.6; padding-left:30px; padding-right:30px; text-decoration:none; padding-bottom:0;">informacione tehnologije nouvelle d.o.o. 16. Oktobar 19, 11000 Beograd</p>
           <a href="https://labcube.rs/politika-privatnosti" style="color:#9C9C9C; font-size:9px; display:inline;  opacity:0.6;  text-decoration:none;">politika privatnosti</a>
           <a href="https://labcube.rs/uslovi-koriscenja" style="color:#9C9C9C; font-size:9px; display:inline;  opacity:0.6;  text-decoration:none;">uslovi korišćenja</a>
           </div>

         </div>`,
         attachments:[{
           filename: 'headerBigEmail.png',
           path: 'src/images/headerBigEmail.png',
           cid: 'headerEmailBig'},
           {
             filename: 'logoFooter.png',
             path: 'src/images/logoFooter.png',
             cid: 'logoFooter'
           }]
       }

       transporter.sendMail(mailOptionsCustomerError, (error, info) => {
           if(error) {
             return console.log(error)
         } else {
           console.log(info.messageId)
         }
       })

       req.flash('error_msg', 'transakcija nije uspešno izvršena')
       res.render('paymentError', {data:data, amount:data.amount, errorPayment, groupNames, user:req.user, title:'LabCube | Greška prilikom plaćanja'})
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
    title:'Labcube | Pretraga'
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
  res.render('details',{analysisDetails, prices, sidebarNav:true, user:req.user, groupNames, title:`Analiza | ${analysisDetails.analysisName}`, metaDescription:analysisDetails.preview, metaKeywords:analysisDetails.alt})
}

exports.labRestultsAnalysis = async (req,res) => {
  let groupNames = await Group.find({},{name:1,slug:1,_id:0}).sort({name:1})
  res.render('labResultsAnalysis', {user:req.user, groupNames, title:'Labcube | Tumačenje laboratorijskih analiza', metaDescription:'Ukoliko ste dobili rezultate laboratorije a ne razumete značenje nekih parametara mi Vam možemo pomoći. Napravite nalog, uradite upload rezultata i u roku od 24h sve će biti jasnije.', metaKeywords:'Tumačenje rezultata laboratorijskih analiza, šta znače povišene vrednosti laboratorijskih analiza, tumačenje rezultata krvne slike'})
}

exports.sendFeedbackLabCube = async (req,res) => {
  let newDate = Date()
  let interpretationFeedback = await Result.findOneAndUpdate(
    {_id:req.params.id},
    {'userFeedback':req.body.interpretationFeedback,'star':req.body.star, feedbackDate:newDate},
    {
      new:true,
      runValidators:true,
      useFindAndModify:false
    }).exec()
    req.flash('success_msg','Uspešno ste poslali komentar. Hvala')
    res.redirect('/myResult/'+req.params.id)
}
