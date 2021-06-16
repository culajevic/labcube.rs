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
let transporter = nodemailer.createTransport({
  host:'smtp.gmail.com',
  service:'gmail',
  port:464,
  auth: {
      type: "OAUTH2",
      user: "labcubee@gmail.com",
      clientId: process.env.CLIENTID,
      clientSecret: process.env.CLIENTSECRET,
      refreshToken: process.env.REFRESHTOKEN,
      accessToken:process.env.ACCESSTOKEN
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
      res.redirect('/tumacenje-laboratorijskih-analiza')
    } else {
      next()
    }
  })
}

exports.payment = (req,res) => {
  // placanje testing


  function request() {
  	const path='/v1/checkouts';
  	const data = querystring.stringify({
  		'entityId':'8ac7a4c77a0d2dd7017a0f4d02c30b47',
  		'amount':'92.00',
  		'currency':'RSD',
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
      res.render('paymentPage', {data:data.id})
    })
    .catch(console.error)


  //placanje test end
}

exports.paymentDone = (req,res) => {

console.log(req.body)

//   const requestCheckout = async (req,res) => {
//   	var path='/v1/checkouts/{id}/payment';
//   	path += '?entityId=8ac7a4c77a0d2dd7017a0f4d02c30b47';
//   	const options = {
//   		port: 443,
//   		host: 'test.oppwa.com',
//   		path: path,
//   		method: 'GET',
//   		headers: {
//   			'Authorization':'Bearer OGFjN2E0Yzc3YTBkMmRkNzAxN2EwZjRiYWYwYTBiNDN8Qjl4U2o2NkRNeA=='
//   		}
//   	};
//   	return new Promise((resolve, reject) => {
//   		const postRequest = https.request(options, function(res) {
//   			const buf = [];
//   			res.on('data', chunk => {
//   				buf.push(Buffer.from(chunk));
//   			});
//   			res.on('end', () => {
//   				const jsonString = Buffer.concat(buf).toString('utf8');
//   				try {
//   					resolve(JSON.parse(jsonString));
//   				} catch (error) {
//   					reject(error);
//   				}
//   			});
//   		});
//   		postRequest.on('error', reject);
//   		postRequest.end();
//   	});
//   };
//
// requestCheckout()
// .then(console.log)
// .catch(console.error);

}

exports.labResult = async (req,res) => {

  let errors = []
  if(!req.body.email) {
    errors.push({text:'Obavezno je uneti email adresu'})
  }

  if(!req.body.package) {
    errors.push({text:'Obavezno je odabrati vreme za koje želiš da ti se protumači rezultat'})
  }

  if(!req.file) {
    errors.push({text:'Nedostaju rezultati koje želiš da ti protumačimo'})
  }
  if(errors.length > 0) {
    res.render('labResultsAnalysis', {
      errors,
      package:req.body.package,
      email:req.body.email,
      user:req.user
    })
  } else {
    if(req.file) {
      req.body.result = req.file.filename
      req.body.submitedDate = Date.now()
      req.body.owner = ''
      let deadline = new Date()
        deadline.setHours(deadline.getHours() + parseInt(req.body.package))
      req.body.deadline = deadline
    } else {
      req.flash('error_msg', 'doslo je do greske prilikom uploada')
    }

    const resultUpload = new Result(req.body)
    try {
      await resultUpload.save()
      let mailOptions = {
        from:'labcubee@gmail.com',
        to:'culajevic@gmail.com',
        subject:'lab results',
        text:'',
        html:`${req.body.email} i ${req.body.package}`,
        attachments:[{
          filename:req.file.filename,
          path:req.file.path
        }]

      }
      transporter.sendMail(mailOptions, (error, info) => {
          if(error) {
            return console.log(error)
        } else {
          console.log('message sent', info.messageId)
        }
        })
      req.flash('success_msg','Vaši rezultati su uspešno prosleđeni na tumačenje')
      res.redirect('/')
      }
    catch (e) {
      req.flash('error_msg', `Dogodila se greška prilikom slanja rezultata ${e}`)
      res.redirect('/tumacenje-laboratorijskih-analiza')
    }
  }
}



exports.displayResults = async (req,res) => {
  const groupNames = await Group.find({},{name:1,slug:1,_id:0}).sort({name:1})
  res.render('results',{
    sidebarNav:false,
    groupNames,
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
  res.render('details',{analysisDetails, prices, sidebarNav:true, user:req.user, groupNames})
}

exports.labRestultsAnalysis = async (req,res) => {
  let groupNames = await Group.find({},{name:1,slug:1,_id:0}).sort({name:1})
  res.render('labResultsAnalysis', {user:req.user, groupNames, title:'Labcube - Tumačenje laboratorijskih analiza'})
}
