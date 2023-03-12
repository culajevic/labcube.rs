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
  let total =  req.body[0].total
  let labId =  req.body[3].labId
  let labCubePrice = req.body[2].labCubePrice
  let getLabData = await Lab.find({_id:labId},{email:1, comment:1, labName:1, address:1, workingHours:1, phone:1, slug:1}).populate('placeId')
  let getEmailforSending =  getLabData[0].email
  let discountCode = getLabData[0].comment
  let getUserData = await User.find({_id:req.user._id}, {email:1, username:1})
  let getUserEmail = getUserData[0].email
  let getUserName = getUserData[0].username
  

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
    subject:`Novi pacijent | ${getUserEmail} | ${getUserName} `,
    text:`Potrebne analize \n ${getBullets} \n ukupna cena je ${total} \n labcube.rs` ,
    html:`
    <h1>Novi LabCube pacijent | ${getUserName}</h1>
    <h2>Cena za odabrane analize: ${total} din. + trošak uzimanja uzorka</h2>
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
    to:(getUserEmail),
    bcc:'culajevic@gmail.com',
    subject:'Uspešno odabrane analize',
    html:`
    <!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <!-- NAME: EDUCATE -->
        <!--[if gte mso 15]>
        <xml>
            <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title></title>
        
    <style type="text/css">
		p{
			margin:10px 0;
			padding:0;
		}
		table{
			border-collapse:collapse;
		}
		h1,h2,h3,h4,h5,h6{
			display:block;
			margin:0;
			padding:0;
		}
		img,a img{
			border:0;
			height:auto;
			outline:none;
			text-decoration:none;
		}
		body,#bodyTable,#bodyCell{
			height:100%;
			margin:0;
			padding:0;
			width:100%;
		}
		.mcnPreviewText{
			display:none !important;
		}
		#outlook a{
			padding:0;
		}
		img{
			-ms-interpolation-mode:bicubic;
		}
		table{
			mso-table-lspace:0pt;
			mso-table-rspace:0pt;
		}
		.ReadMsgBody{
			width:100%;
		}
		.ExternalClass{
			width:100%;
		}
		p,a,li,td,blockquote{
			mso-line-height-rule:exactly;
		}
		a[href^=tel],a[href^=sms]{
			color:inherit;
			cursor:default;
			text-decoration:none;
		}
		p,a,li,td,body,table,blockquote{
			-ms-text-size-adjust:100%;
			-webkit-text-size-adjust:100%;
		}
		.ExternalClass,.ExternalClass p,.ExternalClass td,.ExternalClass div,.ExternalClass span,.ExternalClass font{
			line-height:100%;
		}
		a[x-apple-data-detectors]{
			color:inherit !important;
			text-decoration:none !important;
			font-size:inherit !important;
			font-family:inherit !important;
			font-weight:inherit !important;
			line-height:inherit !important;
		}
		.templateContainer{
			max-width:600px !important;
		}
		a.mcnButton{
			display:block;
		}
		.mcnImage,.mcnRetinaImage{
			vertical-align:bottom;
		}
		.mcnTextContent{
			word-break:break-word;
		}
		.mcnTextContent img{
			height:auto !important;
		}
		.mcnDividerBlock{
			table-layout:fixed !important;
		}
	/*
	@tab Page
	@section Heading 1
	@style heading 1
	*/
		h1{
			/*@editable*/color:#222222;
			/*@editable*/font-family:Helvetica;
			/*@editable*/font-size:40px;
			/*@editable*/font-style:normal;
			/*@editable*/font-weight:bold;
			/*@editable*/line-height:150%;
			/*@editable*/letter-spacing:normal;
			/*@editable*/text-align:left;
		}
	/*
	@tab Page
	@section Heading 2
	@style heading 2
	*/
		h2{
			/*@editable*/color:#222222;
			/*@editable*/font-family:Helvetica;
			/*@editable*/font-size:28px;
			/*@editable*/font-style:normal;
			/*@editable*/font-weight:bold;
			/*@editable*/line-height:150%;
			/*@editable*/letter-spacing:normal;
			/*@editable*/text-align:left;
		}
	/*
	@tab Page
	@section Heading 3
	@style heading 3
	*/
		h3{
			/*@editable*/color:#444444;
			/*@editable*/font-family:Helvetica;
			/*@editable*/font-size:22px;
			/*@editable*/font-style:normal;
			/*@editable*/font-weight:bold;
			/*@editable*/line-height:150%;
			/*@editable*/letter-spacing:normal;
			/*@editable*/text-align:left;
		}
	/*
	@tab Page
	@section Heading 4
	@style heading 4
	*/
		h4{
			/*@editable*/color:#949494;
			/*@editable*/font-family:Georgia;
			/*@editable*/font-size:20px;
			/*@editable*/font-style:italic;
			/*@editable*/font-weight:normal;
			/*@editable*/line-height:125%;
			/*@editable*/letter-spacing:normal;
			/*@editable*/text-align:left;
		}
	/*
	@tab Header
	@section Header Container Style
	*/
		#templateHeader{
			/*@editable*/background-color:#f7f7f7;
			/*@editable*/background-image:url("https://mcusercontent.com/a10f76f8952b08c139ac9f0ef/images/c0fb8818-1c0c-41b1-a9ae-7db43f482310.png");
			/*@editable*/background-repeat:no-repeat;
			/*@editable*/background-position:center;
			/*@editable*/background-size:cover;
			/*@editable*/border-top:0;
			/*@editable*/border-bottom:0;
			/*@editable*/padding-top:85px;
			/*@editable*/padding-bottom:85px;
		}
	/*
	@tab Header
	@section Header Interior Style
	*/
		.headerContainer{
			/*@editable*/background-color:#transparent;
			/*@editable*/background-image:none;
			/*@editable*/background-repeat:no-repeat;
			/*@editable*/background-position:center;
			/*@editable*/background-size:cover;
			/*@editable*/border-top:0;
			/*@editable*/border-bottom:0;
			/*@editable*/padding-top:0;
			/*@editable*/padding-bottom:0;
		}
	/*
	@tab Header
	@section Header Text
	*/
		.headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{
			/*@editable*/color:#757575;
			/*@editable*/font-family:Helvetica;
			/*@editable*/font-size:16px;
			/*@editable*/line-height:150%;
			/*@editable*/text-align:left;
		}
	/*
	@tab Header
	@section Header Link
	*/
		.headerContainer .mcnTextContent a,.headerContainer .mcnTextContent p a{
			/*@editable*/color:#007C89;
			/*@editable*/font-weight:normal;
			/*@editable*/text-decoration:underline;
		}
	/*
	@tab Body
	@section Body Container Style
	*/
		#templateBody{
			/*@editable*/background-color:#ffffff;
			/*@editable*/background-image:none;
			/*@editable*/background-repeat:no-repeat;
			/*@editable*/background-position:center;
			/*@editable*/background-size:cover;
			/*@editable*/border-top:0;
			/*@editable*/border-bottom:0;
			/*@editable*/padding-top:23px;
			/*@editable*/padding-bottom:23px;
		}
	/*
	@tab Body
	@section Body Interior Style
	*/
		.bodyContainer{
			/*@editable*/background-color:#transparent;
			/*@editable*/background-image:none;
			/*@editable*/background-repeat:no-repeat;
			/*@editable*/background-position:center;
			/*@editable*/background-size:cover;
			/*@editable*/border-top:0;
			/*@editable*/border-bottom:0;
			/*@editable*/padding-top:0;
			/*@editable*/padding-bottom:0;
		}
	/*
	@tab Body
	@section Body Text
	*/
		.bodyContainer .mcnTextContent,.bodyContainer .mcnTextContent p{
			/*@editable*/color:#757575;
			/*@editable*/font-family:Helvetica;
			/*@editable*/font-size:16px;
			/*@editable*/line-height:150%;
			/*@editable*/text-align:left;
		}
	/*
	@tab Body
	@section Body Link
	*/
		.bodyContainer .mcnTextContent a,.bodyContainer .mcnTextContent p a{
			/*@editable*/color:#007C89;
			/*@editable*/font-weight:normal;
			/*@editable*/text-decoration:underline;
		}
	/*
	@tab Footer
	@section Footer Style
	*/
		#templateFooter{
			/*@editable*/background-color:#ffffff;
			/*@editable*/background-image:none;
			/*@editable*/background-repeat:no-repeat;
			/*@editable*/background-position:center;
			/*@editable*/background-size:cover;
			/*@editable*/border-top:0;
			/*@editable*/border-bottom:0;
			/*@editable*/padding-top:45px;
			/*@editable*/padding-bottom:63px;
		}
	/*
	@tab Footer
	@section Footer Interior Style
	*/
		.footerContainer{
			/*@editable*/background-color:#transparent;
			/*@editable*/background-image:none;
			/*@editable*/background-repeat:no-repeat;
			/*@editable*/background-position:center;
			/*@editable*/background-size:cover;
			/*@editable*/border-top:0;
			/*@editable*/border-bottom:0;
			/*@editable*/padding-top:0;
			/*@editable*/padding-bottom:0;
		}
	/*
	@tab Footer
	@section Footer Text
	*/
		.footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{
			/*@editable*/color:#FFFFFF;
			/*@editable*/font-family:Helvetica;
			/*@editable*/font-size:12px;
			/*@editable*/line-height:150%;
			/*@editable*/text-align:center;
		}
	/*
	@tab Footer
	@section Footer Link
	*/
		.footerContainer .mcnTextContent a,.footerContainer .mcnTextContent p a{
			/*@editable*/color:#FFFFFF;
			/*@editable*/font-weight:normal;
			/*@editable*/text-decoration:underline;
		}
	@media only screen and (min-width:768px){
		.templateContainer{
			width:600px !important;
		}

}	@media only screen and (max-width: 480px){
		body,table,td,p,a,li,blockquote{
			-webkit-text-size-adjust:none !important;
		}

}	@media only screen and (max-width: 480px){
		body{
			width:100% !important;
			min-width:100% !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnRetinaImage{
			max-width:100% !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnImage{
			width:100% !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnCartContainer,.mcnCaptionTopContent,.mcnRecContentContainer,.mcnCaptionBottomContent,.mcnTextContentContainer,.mcnBoxedTextContentContainer,.mcnImageGroupContentContainer,.mcnCaptionLeftTextContentContainer,.mcnCaptionRightTextContentContainer,.mcnCaptionLeftImageContentContainer,.mcnCaptionRightImageContentContainer,.mcnImageCardLeftTextContentContainer,.mcnImageCardRightTextContentContainer,.mcnImageCardLeftImageContentContainer,.mcnImageCardRightImageContentContainer{
			max-width:100% !important;
			width:100% !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnBoxedTextContentContainer{
			min-width:100% !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnImageGroupContent{
			padding:9px !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnCaptionLeftContentOuter .mcnTextContent,.mcnCaptionRightContentOuter .mcnTextContent{
			padding-top:9px !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnImageCardTopImageContent,.mcnCaptionBottomContent:last-child .mcnCaptionBottomImageContent,.mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent{
			padding-top:18px !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnImageCardBottomImageContent{
			padding-bottom:9px !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnImageGroupBlockInner{
			padding-top:0 !important;
			padding-bottom:0 !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnImageGroupBlockOuter{
			padding-top:9px !important;
			padding-bottom:9px !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnTextContent,.mcnBoxedTextContentColumn{
			padding-right:18px !important;
			padding-left:18px !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnImageCardLeftImageContent,.mcnImageCardRightImageContent{
			padding-right:18px !important;
			padding-bottom:0 !important;
			padding-left:18px !important;
		}

}	@media only screen and (max-width: 480px){
		.mcpreview-image-uploader{
			display:none !important;
			width:100% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Heading 1
	@tip Make the first-level headings larger in size for better readability on small screens.
	*/
		h1{
			/*@editable*/font-size:30px !important;
			/*@editable*/line-height:125% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Heading 2
	@tip Make the second-level headings larger in size for better readability on small screens.
	*/
		h2{
			/*@editable*/font-size:26px !important;
			/*@editable*/line-height:125% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Heading 3
	@tip Make the third-level headings larger in size for better readability on small screens.
	*/
		h3{
			/*@editable*/font-size:20px !important;
			/*@editable*/line-height:150% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Heading 4
	@tip Make the fourth-level headings larger in size for better readability on small screens.
	*/
		h4{
			/*@editable*/font-size:18px !important;
			/*@editable*/line-height:150% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Boxed Text
	@tip Make the boxed text larger in size for better readability on small screens. We recommend a font size of at least 16px.
	*/
		.mcnBoxedTextContentContainer .mcnTextContent,.mcnBoxedTextContentContainer .mcnTextContent p{
			/*@editable*/font-size:14px !important;
			/*@editable*/line-height:150% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Header Text
	@tip Make the header text larger in size for better readability on small screens.
	*/
		.headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{
			/*@editable*/font-size:16px !important;
			/*@editable*/line-height:150% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Body Text
	@tip Make the body text larger in size for better readability on small screens. We recommend a font size of at least 16px.
	*/
		.bodyContainer .mcnTextContent,.bodyContainer .mcnTextContent p{
			/*@editable*/font-size:16px !important;
			/*@editable*/line-height:150% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Footer Text
	@tip Make the footer content text larger in size for better readability on small screens.
	*/
		.footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{
			/*@editable*/font-size:14px !important;
			/*@editable*/line-height:150% !important;
		}

}</style></head>
    <body>
        <center>
            <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">
                <tr>
                    <td align="center" valign="top" id="bodyCell">
                        <!-- BEGIN TEMPLATE // -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td align="center" valign="top" id="templateHeader" data-template-container>
                                    <!--[if (gte mso 9)|(IE)]>
                                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                    <tr>
                                    <td align="center" valign="top" width="600" style="width:600px;">
                                    <![endif]-->
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                        <tr>
                                            <td valign="top" class="headerContainer"></td>
                                        </tr>
                                    </table>
                                    <!--[if (gte mso 9)|(IE)]>
                                    </td>
                                    </tr>
                                    </table>
                                    <![endif]-->
                                </td>
                            </tr>
                            <tr>
                                <td align="center" valign="top" id="templateBody" data-template-container>
                                    <!--[if (gte mso 9)|(IE)]>
                                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                    <tr>
                                    <td align="center" valign="top" width="600" style="width:600px;">
                                    <![endif]-->
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                        <tr>
                                            <td valign="top" class="bodyContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
    <tbody class="mcnTextBlockOuter">
        <tr>
            <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
              	<!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->
			    
				<!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                    <tbody><tr>
                        
                        <td valign="top" class="mcnTextContent" style="padding: 0px 18px 9px; line-height: 200%;">
                        
                            <h2 style="text-align: center;"><style="font-size:20px;">Laboratorija <span style="color:#1D88E5;"><a href="${req.get('referer')}" style="text-decoration:none;">${getLabData[0].labName}</a></span> Vas očekuje!</h2>
&nbsp;

<p style="line-height: 200%;"><span style="font-size:18px"><img data-file-id="6005129" height="18" src="https://mcusercontent.com/a10f76f8952b08c139ac9f0ef/images/e8d426a8-ac5d-fdfd-90c0-f01d6f11be9a.png" style="border: 0px  ; width: 17px; height: 18px; margin: 0px; margin-bottom:-3px;" width="17"> ${getLabData[0].address}, ${getLabData[0].placeId.place}<br>
<img data-file-id="6005133" height="18" src="https://mcusercontent.com/a10f76f8952b08c139ac9f0ef/images/c8f09b5b-8a6c-2f04-65ca-c09acabd4a6a.png" style="border: 0px  ; width: 10px; height: 18px; margin: 0px; margin-left:1px; margin-bottom:-3px; margin-right:5px;" width="10"> ${getLabData[0].phone}</span></p>

                        </td>
                    </tr>
                </tbody></table>
				<!--[if mso]>
				</td>
				<![endif]-->
                
				<!--[if mso]>
				</tr>
				</table>
				<![endif]-->
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;">
    <tbody class="mcnDividerBlockOuter">
        <tr>
            <td class="mcnDividerBlockInner" style="min-width: 100%; padding: 10px 18px;">
                <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-top: 2px solid #EAEAEA;">
                    <tbody><tr>
                        <td>
                            <span></span>
                        </td>
                    </tr>
                </tbody></table>
<!--            
                <td class="mcnDividerBlockInner" style="padding: 18px;">
                <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
-->
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;">
    <tbody class="mcnDividerBlockOuter">
        <tr>
            <td class="mcnDividerBlockInner" style="min-width: 100%; padding: 18px 18px 0px;">
                <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;">
                    <tbody><tr>
                        <td>
                            <span></span>
                        </td>
                    </tr>
                </tbody></table>
<!--            
                <td class="mcnDividerBlockInner" style="padding: 18px;">
                <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
-->
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
    <tbody class="mcnTextBlockOuter">
        <tr>
            <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
              	<!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->
			    
				<!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                    <tbody><tr>
                        
                        <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                        
                            <span style="font-size:18px">Radno vreme laboratorije</span><br /><br />
							<table>
								<tr>
								  <th style="text-align:center;">P</th>
								  <th style="text-align:center;">U</th>
								  <th style="text-align:center;">S</th>
								  <th style="text-align:center;">Č</th>
								  <th style="text-align:center;">P</th>
								  <th style="text-align:center;">S</th>
								  <th style="text-align:center;">N</th>
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
                        </td>
                    </tr>
                </tbody></table>
				<!--[if mso]>
				</td>
				<![endif]-->
                
				<!--[if mso]>
				</tr>
				</table>
				<![endif]-->
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
    <tbody class="mcnTextBlockOuter">
        <tr>
            <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
              	<!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->
			    
				<!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                    <tbody><tr>
                        
                        <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                        
                            <span style="font-size:18px">Odabrane analize</span>
							<ol style="font-size:18px;">${getBullets.join(' ')}</ol>
                        </td>
                    </tr>
                </tbody></table>
				<!--[if mso]>
				</td>
				<![endif]-->
                
				<!--[if mso]>
				</tr>
				</table>
				<![endif]-->
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnBoxedTextBlock" style="min-width:100%;">
    <!--[if gte mso 9]>
	<table align="center" border="0" cellspacing="0" cellpadding="0" width="100%">
	<![endif]-->
	<tbody class="mcnBoxedTextBlockOuter">
        <tr>
            <td valign="top" class="mcnBoxedTextBlockInner">
                
				<!--[if gte mso 9]>
				<td align="center" valign="top" ">
				<![endif]-->
                <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;" class="mcnBoxedTextContentContainer">
                    <tbody><tr>
                        
                        <td style="padding-top:9px; padding-left:18px; padding-bottom:9px; padding-right:18px;">
                        
                            <table border="0" cellspacing="0" class="mcnTextContentContainer" width="100%" style="min-width: 100% !important;background-color: #1D88E5; border-radius: 7px; line-height:16px;">
                                <tbody><tr>
                                    <td valign="top" class="mcnTextContent" style="padding: 18px;color: #F2F2F2;font-family: Helvetica;font-size: 14px;font-weight: normal;text-align: center;">
                                        <span style="font-size:32px">${total} din. </span><br /><span style="font-size:19px;">+ trošak uzimanja uzorka</span>
                                    </td>
                                </tr>
                            </tbody></table>
                        </td>
                    </tr>
                </tbody></table>
				<!--[if gte mso 9]>
				</td>
				<![endif]-->
                
				<!--[if gte mso 9]>
                </tr>
                </table>
				<![endif]-->
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;">
    <tbody class="mcnDividerBlockOuter">
        <tr>
            <td class="mcnDividerBlockInner" style="min-width:100%; padding:18px;">
                <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-top: 2px solid #EAEAEA;">
                    <tbody><tr>
                        <td>
                            <span></span>
                        </td>
                    </tr>
                </tbody></table>
<!--            
                <td class="mcnDividerBlockInner" style="padding: 18px;">
                <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
-->
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnButtonBlock" style="min-width:100%;">
    <tbody class="mcnButtonBlockOuter">
        <tr>
            <td style="padding-top:0; padding-right:18px; padding-bottom:18px; padding-left:18px;" valign="top" align="center" class="mcnButtonBlockInner">
                <table border="0" cellpadding="0" cellspacing="0" class="mcnButtonContentContainer" style="border-collapse: separate !important;border-radius: 7px;background-color: #FF6F6F;">
                    <tbody>
                        <tr>
                            <td align="center" valign="middle" class="mcnButtonContent" style="font-family: Arial; font-size: 30px; padding: 18px;">
                                <a href="labcube.rs/tumacenje-laboratorijskih-analiza" class="mcnButton " title="${discountCode}" target="_blank" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;">${discountCode}</a>
								<span style="color: #FFFFFF; font-size: 14px; font-family: Arial;">Kôd za besplatno tumačenje rezultata</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
    <tbody class="mcnTextBlockOuter">
        <tr>
            <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
              	<!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->
			    
				<!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                    <tbody><tr>
                        
                        <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                        
                            <span style="font-size:18px">Kada dobiješ rezultate uloguj se na <a href="https://labcube.rs/prijava" target="_blank">labcube.rs</a> a zatim popuni svoj zdravstveni profil kako bismo što bolje sagledati tvoje trenutno zdravstveno stanje. Nakon toga <a href="https://labcube.rs/tumacenje-laboratorijskih-analiza" target="_blank">unesi kôd</a> za besplatno tumačenje koji smo ti poslali i pošalji nam svoje rezultate.</span>
                        </td>
                    </tr>
                </tbody></table>
				<!--[if mso]>
				</td>
				<![endif]-->
                
				<!--[if mso]>
				</tr>
				</table>
				<![endif]-->
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;">
    <tbody class="mcnDividerBlockOuter">
        <tr>
            <td class="mcnDividerBlockInner" style="min-width:100%; padding:18px;">
                <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-top: 2px solid #EAEAEA;">
                    <tbody><tr>
                        <td>
                            <span></span>
                        </td>
                    </tr>
                </tbody></table>
<!--            
                <td class="mcnDividerBlockInner" style="padding: 18px;">
                <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
-->
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
    <tbody class="mcnTextBlockOuter">
        <tr>
            <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
              	<!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->
			    
				<!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                    <tbody><tr>
                        
                        <td valign="top" class="mcnTextContent" style="padding: 0px 18px 9px;color: #FF6F6F;line-height: 200%;">
                        
                            <h3 style="text-align: center;">Ne postavljamo dijagnozu, ne određujemo terapiju i ne lečimo!</h3>

                        </td>
                    </tr>
                </tbody></table>
				<!--[if mso]>
				</td>
				<![endif]-->
                
				<!--[if mso]>
				</tr>
				</table>
				<![endif]-->
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
    <tbody class="mcnTextBlockOuter">
        <tr>
            <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
              	<!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->
			    
				<!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                    <tbody><tr>
                        
                        <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                        
                            <div style="text-align: center;"><span style="font-size:12px"><a href="https://labcube.rs/politika-privatnosti" target="_blank">politika privatnosti</a>&nbsp;| <a href="https://labcube.rs/uslovi-koriscenja" target="_blank">uslovi korišćenja</a>&nbsp;| <a href="https://labcube.rs/uslovi-placanja" target="_blank">uslovi plačanja</a>&nbsp;</span></div>

                        </td>
                    </tr>
                </tbody></table>
				<!--[if mso]>
				</td>
				<![endif]-->
                
				<!--[if mso]>
				</tr>
				</table>
				<![endif]-->
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
    <tbody class="mcnTextBlockOuter">
        <tr>
            <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
              	<!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->
			    
				<!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                    <tbody><tr>
                        
                        <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                        
                            <div style="text-align: center;"><span style="font-size:10px">Informacione tehnologije Nouvelle doo, 16. Oktobar 19, 11000 Beograd</span></div>

                        </td>
                    </tr>
                </tbody></table>
				<!--[if mso]>
				</td>
				<![endif]-->
                
				<!--[if mso]>
				</tr>
				</table>
				<![endif]-->
            </td>
        </tr>
    </tbody>
</table></td>
                                        </tr>
                                    </table>
                                    <!--[if (gte mso 9)|(IE)]>
                                    </td>
                                    </tr>
                                    </table>
                                    <![endif]-->
                                </td>
                            </tr>
                            <tr>
                                <td align="center" valign="top" id="templateFooter" data-template-container>
                                    <!--[if (gte mso 9)|(IE)]>
                                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                    <tr>
                                    <td align="center" valign="top" width="600" style="width:600px;">
                                    <![endif]-->
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                        <tr>
                                            <td valign="top" class="footerContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">

</table></td>
                                        </tr>
                                    </table>
                                    <!--[if (gte mso 9)|(IE)]>
                                    </td>
                                    </tr>
                                    </table>
                                    <![endif]-->
                                </td>
                            </tr>
                        </table>
                        <!-- // END TEMPLATE -->
                    </td>
                </tr>
            </table>
        </center>
    <script type="text/javascript"  src="/F_7rRi1-VC1l/uq43LV/ZFiBT9/fa9zDww8iO5a1S/WRZ9AQ/KgYeQy/khPSQ"></script></body>
</html> `,
    attachments:[
      // {
      //   filename: 'sentToLabHeader.png',
      //   path: 'src/images/sentToLabHeader.png',
      //   cid: 'sentToLabHeader'}
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
      from:'LabCube <labcube-tumacenje-no-reply@labcube.rs>',
      to:[req.body.email, 'tumacenje@labcube.rs'],
      bcc:['culajevic@gmail.com'],
      subject:'Protumačeni rezultati',
      text:'',
      html:`<!doctype html>
      <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
          <head>
              <!-- NAME: EDUCATE -->
              <!--[if gte mso 15]>
              <xml>
                  <o:OfficeDocumentSettings>
                  <o:AllowPNG/>
                  <o:PixelsPerInch>96</o:PixelsPerInch>
                  </o:OfficeDocumentSettings>
              </xml>
              <![endif]-->
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <title>Rezultati su protumačeni</title>
              
          <style type="text/css">
          p{
            margin:10px 0;
            padding:0;
          }
          table{
            border-collapse:collapse;
          }
          h1,h2,h3,h4,h5,h6{
            display:block;
            margin:0;
            padding:0;
          }
          img,a img{
            border:0;
            height:auto;
            outline:none;
            text-decoration:none;
          }
          body,#bodyTable,#bodyCell{
            height:100%;
            margin:0;
            padding:0;
            width:100%;
          }
          .mcnPreviewText{
            display:none !important;
          }
          #outlook a{
            padding:0;
          }
          img{
            -ms-interpolation-mode:bicubic;
          }
          table{
            mso-table-lspace:0pt;
            mso-table-rspace:0pt;
          }
          .ReadMsgBody{
            width:100%;
          }
          .ExternalClass{
            width:100%;
          }
          p,a,li,td,blockquote{
            mso-line-height-rule:exactly;
          }
          a[href^=tel],a[href^=sms]{
            color:inherit;
            cursor:default;
            text-decoration:none;
          }
          p,a,li,td,body,table,blockquote{
            -ms-text-size-adjust:100%;
            -webkit-text-size-adjust:100%;
          }
          .ExternalClass,.ExternalClass p,.ExternalClass td,.ExternalClass div,.ExternalClass span,.ExternalClass font{
            line-height:100%;
          }
          a[x-apple-data-detectors]{
            color:inherit !important;
            text-decoration:none !important;
            font-size:inherit !important;
            font-family:inherit !important;
            font-weight:inherit !important;
            line-height:inherit !important;
          }
          .templateContainer{
            max-width:600px !important;
          }
          a.mcnButton{
            display:block;
          }
          .mcnImage,.mcnRetinaImage{
            vertical-align:bottom;
          }
          .mcnTextContent{
            word-break:break-word;
          }
          .mcnTextContent img{
            height:auto !important;
          }
          .mcnDividerBlock{
            table-layout:fixed !important;
          }
        /*
        @tab Page
        @section Heading 1
        @style heading 1
        */
          h1{
            /*@editable*/color:#222222;
            /*@editable*/font-family:Helvetica;
            /*@editable*/font-size:40px;
            /*@editable*/font-style:normal;
            /*@editable*/font-weight:bold;
            /*@editable*/line-height:150%;
            /*@editable*/letter-spacing:normal;
            /*@editable*/text-align:left;
          }
        /*
        @tab Page
        @section Heading 2
        @style heading 2
        */
          h2{
            /*@editable*/color:#222222;
            /*@editable*/font-family:Helvetica;
            /*@editable*/font-size:28px;
            /*@editable*/font-style:normal;
            /*@editable*/font-weight:bold;
            /*@editable*/line-height:150%;
            /*@editable*/letter-spacing:normal;
            /*@editable*/text-align:left;
          }
        /*
        @tab Page
        @section Heading 3
        @style heading 3
        */
          h3{
            /*@editable*/color:#444444;
            /*@editable*/font-family:Helvetica;
            /*@editable*/font-size:22px;
            /*@editable*/font-style:normal;
            /*@editable*/font-weight:bold;
            /*@editable*/line-height:150%;
            /*@editable*/letter-spacing:normal;
            /*@editable*/text-align:left;
          }
        /*
        @tab Page
        @section Heading 4
        @style heading 4
        */
          h4{
            /*@editable*/color:#949494;
            /*@editable*/font-family:Georgia;
            /*@editable*/font-size:20px;
            /*@editable*/font-style:italic;
            /*@editable*/font-weight:normal;
            /*@editable*/line-height:125%;
            /*@editable*/letter-spacing:normal;
            /*@editable*/text-align:left;
          }
        /*
        @tab Header
        @section Header Container Style
        */
          #templateHeader{
            /*@editable*/background-color:#f7f7f7;
            /*@editable*/background-image:url("https://mcusercontent.com/a10f76f8952b08c139ac9f0ef/images/c0fb8818-1c0c-41b1-a9ae-7db43f482310.png");
            /*@editable*/background-repeat:no-repeat;
            /*@editable*/background-position:center;
            /*@editable*/background-size:cover;
            /*@editable*/border-top:0;
            /*@editable*/border-bottom:0;
            /*@editable*/padding-top:85px;
            /*@editable*/padding-bottom:85px;
          }
        /*
        @tab Header
        @section Header Interior Style
        */
          .headerContainer{
            /*@editable*/background-color:#transparent;
            /*@editable*/background-image:none;
            /*@editable*/background-repeat:no-repeat;
            /*@editable*/background-position:center;
            /*@editable*/background-size:cover;
            /*@editable*/border-top:0;
            /*@editable*/border-bottom:0;
            /*@editable*/padding-top:0;
            /*@editable*/padding-bottom:0;
          }
        /*
        @tab Header
        @section Header Text
        */
          .headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{
            /*@editable*/color:#757575;
            /*@editable*/font-family:Helvetica;
            /*@editable*/font-size:16px;
            /*@editable*/line-height:150%;
            /*@editable*/text-align:left;
          }
        /*
        @tab Header
        @section Header Link
        */
          .headerContainer .mcnTextContent a,.headerContainer .mcnTextContent p a{
            /*@editable*/color:#007C89;
            /*@editable*/font-weight:normal;
            /*@editable*/text-decoration:underline;
          }
        /*
        @tab Body
        @section Body Container Style
        */
          #templateBody{
            /*@editable*/background-color:#ffffff;
            /*@editable*/background-image:none;
            /*@editable*/background-repeat:no-repeat;
            /*@editable*/background-position:center;
            /*@editable*/background-size:cover;
            /*@editable*/border-top:0;
            /*@editable*/border-bottom:0;
            /*@editable*/padding-top:23px;
            /*@editable*/padding-bottom:23px;
          }
        /*
        @tab Body
        @section Body Interior Style
        */
          .bodyContainer{
            /*@editable*/background-color:#transparent;
            /*@editable*/background-image:none;
            /*@editable*/background-repeat:no-repeat;
            /*@editable*/background-position:center;
            /*@editable*/background-size:cover;
            /*@editable*/border-top:0;
            /*@editable*/border-bottom:0;
            /*@editable*/padding-top:0;
            /*@editable*/padding-bottom:0;
          }
        /*
        @tab Body
        @section Body Text
        */
          .bodyContainer .mcnTextContent,.bodyContainer .mcnTextContent p{
            /*@editable*/color:#757575;
            /*@editable*/font-family:Helvetica;
            /*@editable*/font-size:16px;
            /*@editable*/line-height:150%;
            /*@editable*/text-align:left;
          }
        /*
        @tab Body
        @section Body Link
        */
          .bodyContainer .mcnTextContent a,.bodyContainer .mcnTextContent p a{
            /*@editable*/color:#007C89;
            /*@editable*/font-weight:normal;
            /*@editable*/text-decoration:underline;
          }
        /*
        @tab Footer
        @section Footer Style
        */
          #templateFooter{
            /*@editable*/background-color:#ffffff;
            /*@editable*/background-image:none;
            /*@editable*/background-repeat:no-repeat;
            /*@editable*/background-position:center;
            /*@editable*/background-size:cover;
            /*@editable*/border-top:0;
            /*@editable*/border-bottom:0;
            /*@editable*/padding-top:45px;
            /*@editable*/padding-bottom:63px;
          }
        /*
        @tab Footer
        @section Footer Interior Style
        */
          .footerContainer{
            /*@editable*/background-color:#transparent;
            /*@editable*/background-image:none;
            /*@editable*/background-repeat:no-repeat;
            /*@editable*/background-position:center;
            /*@editable*/background-size:cover;
            /*@editable*/border-top:0;
            /*@editable*/border-bottom:0;
            /*@editable*/padding-top:0;
            /*@editable*/padding-bottom:0;
          }
        /*
        @tab Footer
        @section Footer Text
        */
          .footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{
            /*@editable*/color:#FFFFFF;
            /*@editable*/font-family:Helvetica;
            /*@editable*/font-size:12px;
            /*@editable*/line-height:150%;
            /*@editable*/text-align:center;
          }
        /*
        @tab Footer
        @section Footer Link
        */
          .footerContainer .mcnTextContent a,.footerContainer .mcnTextContent p a{
            /*@editable*/color:#FFFFFF;
            /*@editable*/font-weight:normal;
            /*@editable*/text-decoration:underline;
          }
        @media only screen and (min-width:768px){
          .templateContainer{
            width:600px !important;
          }
      
      }	@media only screen and (max-width: 480px){
          body,table,td,p,a,li,blockquote{
            -webkit-text-size-adjust:none !important;
          }
      
      }	@media only screen and (max-width: 480px){
          body{
            width:100% !important;
            min-width:100% !important;
          }
      
      }	@media only screen and (max-width: 480px){
          .mcnRetinaImage{
            max-width:100% !important;
          }
      
      }	@media only screen and (max-width: 480px){
          .mcnImage{
            width:100% !important;
          }
      
      }	@media only screen and (max-width: 480px){
          .mcnCartContainer,.mcnCaptionTopContent,.mcnRecContentContainer,.mcnCaptionBottomContent,.mcnTextContentContainer,.mcnBoxedTextContentContainer,.mcnImageGroupContentContainer,.mcnCaptionLeftTextContentContainer,.mcnCaptionRightTextContentContainer,.mcnCaptionLeftImageContentContainer,.mcnCaptionRightImageContentContainer,.mcnImageCardLeftTextContentContainer,.mcnImageCardRightTextContentContainer,.mcnImageCardLeftImageContentContainer,.mcnImageCardRightImageContentContainer{
            max-width:100% !important;
            width:100% !important;
          }
      
      }	@media only screen and (max-width: 480px){
          .mcnBoxedTextContentContainer{
            min-width:100% !important;
          }
      
      }	@media only screen and (max-width: 480px){
          .mcnImageGroupContent{
            padding:9px !important;
          }
      
      }	@media only screen and (max-width: 480px){
          .mcnCaptionLeftContentOuter .mcnTextContent,.mcnCaptionRightContentOuter .mcnTextContent{
            padding-top:9px !important;
          }
      
      }	@media only screen and (max-width: 480px){
          .mcnImageCardTopImageContent,.mcnCaptionBottomContent:last-child .mcnCaptionBottomImageContent,.mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent{
            padding-top:18px !important;
          }
      
      }	@media only screen and (max-width: 480px){
          .mcnImageCardBottomImageContent{
            padding-bottom:9px !important;
          }
      
      }	@media only screen and (max-width: 480px){
          .mcnImageGroupBlockInner{
            padding-top:0 !important;
            padding-bottom:0 !important;
          }
      
      }	@media only screen and (max-width: 480px){
          .mcnImageGroupBlockOuter{
            padding-top:9px !important;
            padding-bottom:9px !important;
          }
      
      }	@media only screen and (max-width: 480px){
          .mcnTextContent,.mcnBoxedTextContentColumn{
            padding-right:18px !important;
            padding-left:18px !important;
          }
      
      }	@media only screen and (max-width: 480px){
          .mcnImageCardLeftImageContent,.mcnImageCardRightImageContent{
            padding-right:18px !important;
            padding-bottom:0 !important;
            padding-left:18px !important;
          }
      
      }	@media only screen and (max-width: 480px){
          .mcpreview-image-uploader{
            display:none !important;
            width:100% !important;
          }
      
      }	@media only screen and (max-width: 480px){
        /*
        @tab Mobile Styles
        @section Heading 1
        @tip Make the first-level headings larger in size for better readability on small screens.
        */
          h1{
            /*@editable*/font-size:30px !important;
            /*@editable*/line-height:125% !important;
          }
      
      }	@media only screen and (max-width: 480px){
        /*
        @tab Mobile Styles
        @section Heading 2
        @tip Make the second-level headings larger in size for better readability on small screens.
        */
          h2{
            /*@editable*/font-size:26px !important;
            /*@editable*/line-height:125% !important;
          }
      
      }	@media only screen and (max-width: 480px){
        /*
        @tab Mobile Styles
        @section Heading 3
        @tip Make the third-level headings larger in size for better readability on small screens.
        */
          h3{
            /*@editable*/font-size:20px !important;
            /*@editable*/line-height:150% !important;
          }
      
      }	@media only screen and (max-width: 480px){
        /*
        @tab Mobile Styles
        @section Heading 4
        @tip Make the fourth-level headings larger in size for better readability on small screens.
        */
          h4{
            /*@editable*/font-size:18px !important;
            /*@editable*/line-height:150% !important;
          }
      
      }	@media only screen and (max-width: 480px){
        /*
        @tab Mobile Styles
        @section Boxed Text
        @tip Make the boxed text larger in size for better readability on small screens. We recommend a font size of at least 16px.
        */
          .mcnBoxedTextContentContainer .mcnTextContent,.mcnBoxedTextContentContainer .mcnTextContent p{
            /*@editable*/font-size:14px !important;
            /*@editable*/line-height:150% !important;
          }
      
      }	@media only screen and (max-width: 480px){
        /*
        @tab Mobile Styles
        @section Header Text
        @tip Make the header text larger in size for better readability on small screens.
        */
          .headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{
            /*@editable*/font-size:16px !important;
            /*@editable*/line-height:150% !important;
          }
      
      }	@media only screen and (max-width: 480px){
        /*
        @tab Mobile Styles
        @section Body Text
        @tip Make the body text larger in size for better readability on small screens. We recommend a font size of at least 16px.
        */
          .bodyContainer .mcnTextContent,.bodyContainer .mcnTextContent p{
            /*@editable*/font-size:16px !important;
            /*@editable*/line-height:150% !important;
          }
      
      }	@media only screen and (max-width: 480px){
        /*
        @tab Mobile Styles
        @section Footer Text
        @tip Make the footer content text larger in size for better readability on small screens.
        */
          .footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{
            /*@editable*/font-size:14px !important;
            /*@editable*/line-height:150% !important;
          }
      
      }</style>
                          <script>var w=window;if(w.performance||w.mozPerformance||w.msPerformance||w.webkitPerformance){var d=document;AKSB=w.AKSB||{},AKSB.q=AKSB.q||[],AKSB.mark=AKSB.mark||function(e,_){AKSB.q.push(["mark",e,_||(new Date).getTime()])},AKSB.measure=AKSB.measure||function(e,_,t){AKSB.q.push(["measure",e,_,t||(new Date).getTime()])},AKSB.done=AKSB.done||function(e){AKSB.q.push(["done",e])},AKSB.mark("firstbyte",(new Date).getTime()),AKSB.prof={custid:"90616",ustr:"",originlat:"0",clientrtt:"26",ghostip:"104.96.91.77",ipv6:false,pct:"10",clientip:"109.93.95.60",requestid:"196c10b7",region:"25187",protocol:"h2",blver:14,akM:"x",akN:"ae",akTT:"O",akTX:"1",akTI:"196c10b7",ai:"199322",ra:"false",pmgn:"",pmgi:"",pmp:"",qc:""},function(e){var _=d.createElement("script");_.async="async",_.src=e;var t=d.getElementsByTagName("script"),t=t[t.length-1];t.parentNode.insertBefore(_,t)}(("https:"===d.location.protocol?"https:":"http:")+"//ds-aksb-a.akamaihd.net/aksb.min.js")}</script>
                          </head>
          <body>
              <center>
                  <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">
                      <tr>
                          <td align="center" valign="top" id="bodyCell">
                              <!-- BEGIN TEMPLATE // -->
                              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                  <tr>
                                      <td align="center" valign="top" id="templateHeader" data-template-container>
                                          <!--[if (gte mso 9)|(IE)]>
                                          <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                          <tr>
                                          <td align="center" valign="top" width="600" style="width:600px;">
                                          <![endif]-->
                                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                              <tr>
                                                  <td valign="top" class="headerContainer"></td>
                                              </tr>
                                          </table>
                                          <!--[if (gte mso 9)|(IE)]>
                                          </td>
                                          </tr>
                                          </table>
                                          <![endif]-->
                                      </td>
                                  </tr>
                                  <tr>
                                      <td align="center" valign="top" id="templateBody" data-template-container>
                                          <!--[if (gte mso 9)|(IE)]>
                                          <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                          <tr>
                                          <td align="center" valign="top" width="600" style="width:600px;">
                                          <![endif]-->
                                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                              <tr>
                                                  <td valign="top" class="bodyContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
          <tbody class="mcnTextBlockOuter">
              <tr>
                  <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                      <!--[if mso]>
              <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
              <tr>
              <![endif]-->
                
              <!--[if mso]>
              <td valign="top" width="600" style="width:600px;">
              <![endif]-->
                      <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                          <tbody><tr>
                              
                              <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                              
                                  <div style="text-align: center;"><span style="font-size:22px"><span style="color:#1D88E5"><strong>Tvoji rezultati su protumačeni</strong></span></span></div>
      
                              </td>
                          </tr>
                      </tbody></table>
              <!--[if mso]>
              </td>
              <![endif]-->
                      
              <!--[if mso]>
              </tr>
              </table>
              <![endif]-->
                  </td>
              </tr>
          </tbody>
      </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;">
          <tbody class="mcnDividerBlockOuter">
              <tr>
                  <td class="mcnDividerBlockInner" style="min-width: 100%; padding: 10px 18px;">
                      <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-top: 2px solid #EAEAEA;">
                          <tbody><tr>
                              <td>
                                  <span></span>
                              </td>
                          </tr>
                      </tbody></table>
      <!--            
                      <td class="mcnDividerBlockInner" style="padding: 18px;">
                      <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
      -->
                  </td>
              </tr>
          </tbody>
      </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;">
          <tbody class="mcnDividerBlockOuter">
              <tr>
                  <td class="mcnDividerBlockInner" style="min-width: 100%; padding: 18px 18px 0px;">
                      <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;">
                          <tbody><tr>
                              <td>
                                  <span></span>
                              </td>
                          </tr>
                      </tbody></table>
      <!--            
                      <td class="mcnDividerBlockInner" style="padding: 18px;">
                      <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
      -->
                  </td>
              </tr>
          </tbody>
      </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnButtonBlock" style="min-width:100%;">
          <tbody class="mcnButtonBlockOuter">
              <tr>
                  <td style="padding-top:0; padding-right:18px; padding-bottom:18px; padding-left:18px;" valign="top" align="center" class="mcnButtonBlockInner">
                      <table border="0" cellpadding="0" cellspacing="0" class="mcnButtonContentContainer" style="border-collapse: separate !important;border-radius: 19px;background-color: #1D88E5;">
                          <tbody>
                              <tr>
                                  <td align="center" valign="middle" class="mcnButtonContent" style="font-family: Arial; font-size: 18px; padding: 22px;">
                                      <a class="mcnButton " title="POGLEDAJ TUMAČENJE" href="https://labcube.rs/myResult/${req.params.id}" target="_blank" style="font-weight: normal;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;">POGLEDAJ TUMAČENJE</a>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </td>
              </tr>
          </tbody>
      </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;">
          <tbody class="mcnDividerBlockOuter">
              <tr>
                  <td class="mcnDividerBlockInner" style="min-width:100%; padding:18px;">
                      <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-top: 2px solid #EAEAEA;">
                          <tbody><tr>
                              <td>
                                  <span></span>
                              </td>
                          </tr>
                      </tbody></table>
      <!--            
                      <td class="mcnDividerBlockInner" style="padding: 18px;">
                      <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
      -->
                  </td>
              </tr>
          </tbody>
      </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
          <tbody class="mcnTextBlockOuter">
              <tr>
                  <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                      <!--[if mso]>
              <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
              <tr>
              <![endif]-->
                
              <!--[if mso]>
              <td valign="top" width="600" style="width:600px;">
              <![endif]-->
                      <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                          <tbody><tr>
                              
                              <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                              
                                  <div style="text-align: center;"><span style="font-size:13px">Hvala što koristiš naše usluge</span></div>
      
                              </td>
                          </tr>
                      </tbody></table>
              <!--[if mso]>
              </td>
              <![endif]-->
                      
              <!--[if mso]>
              </tr>
              </table>
              <![endif]-->
                  </td>
              </tr>
          </tbody>
      </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;">
          <tbody class="mcnDividerBlockOuter">
              <tr>
                  <td class="mcnDividerBlockInner" style="min-width:100%; padding:18px;">
                      <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-top: 2px solid #EAEAEA;">
                          <tbody><tr>
                              <td>
                                  <span></span>
                              </td>
                          </tr>
                      </tbody></table>
      <!--            
                      <td class="mcnDividerBlockInner" style="padding: 18px;">
                      <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
      -->
                  </td>
              </tr>
          </tbody>
      </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
          <tbody class="mcnTextBlockOuter">
              <tr>
                  <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                      <!--[if mso]>
              <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
              <tr>
              <![endif]-->
                
              <!--[if mso]>
              <td valign="top" width="600" style="width:600px;">
              <![endif]-->
                      <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                          <tbody><tr>
                              
                              <td valign="top" class="mcnTextContent" style="padding: 0px 18px 9px;color: #FF6F6F;line-height: 200%;">
                              
                                  <h3 style="text-align: center;">Ne postavljamo dijagnozu, ne određujemo terapiju i ne lečimo!</h3>
      
                              </td>
                          </tr>
                      </tbody></table>
              <!--[if mso]>
              </td>
              <![endif]-->
                      
              <!--[if mso]>
              </tr>
              </table>
              <![endif]-->
                  </td>
              </tr>
          </tbody>
      </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
          <tbody class="mcnTextBlockOuter">
              <tr>
                  <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                      <!--[if mso]>
              <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
              <tr>
              <![endif]-->
                
              <!--[if mso]>
              <td valign="top" width="600" style="width:600px;">
              <![endif]-->
                      <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                          <tbody><tr>
                              
                              <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                              
                                  <div style="text-align: center;"><span style="font-size:12px"><a href="https://labcube.rs/politika-privatnosti" target="_blank">politika privatnosti</a>&nbsp;| <a href="https://labcube.rs/uslovi-koriscenja" target="_blank">uslovi korišćenja</a>&nbsp;| <a href="https://labcube.rs/uslovi-placanja" target="_blank">uslovi plačanja</a>&nbsp;</span></div>
      
                              </td>
                          </tr>
                      </tbody></table>
              <!--[if mso]>
              </td>
              <![endif]-->
                      
              <!--[if mso]>
              </tr>
              </table>
              <![endif]-->
                  </td>
              </tr>
          </tbody>
      </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
          <tbody class="mcnTextBlockOuter">
              <tr>
                  <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                      <!--[if mso]>
              <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
              <tr>
              <![endif]-->
                
              <!--[if mso]>
              <td valign="top" width="600" style="width:600px;">
              <![endif]-->
                      <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                          <tbody><tr>
                              
                              <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                              
                                  <div style="text-align: center;"><span style="font-size:12px">Informacione tehnologije Nouvelle doo, 16. Oktobar 19, 11000 Beograd</span></div>
      
                              </td>
                          </tr>
                      </tbody></table>
              <!--[if mso]>
              </td>
              <![endif]-->
                      
              <!--[if mso]>
              </tr>
              </table>
              <![endif]-->
                  </td>
              </tr>
          </tbody>
      </table></td>
                                              </tr>
                                          </table>
                                          <!--[if (gte mso 9)|(IE)]>
                                          </td>
                                          </tr>
                                          </table>
                                          <![endif]-->
                                      </td>
                                  </tr>
                                  <tr>
                                      <td align="center" valign="top" id="templateFooter" data-template-container>
                                          <!--[if (gte mso 9)|(IE)]>
                                          <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                          <tr>
                                          <td align="center" valign="top" width="600" style="width:600px;">
                                          <![endif]-->
                                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                              <tr>
                                                  <td valign="top" class="footerContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
          <tbody class="mcnTextBlockOuter">
              <tr>
                  <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                      <!--[if mso]>
              <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
              <tr>
              <![endif]-->
                
              <!--[if mso]>
              <td valign="top" width="600" style="width:600px;">
              <![endif]-->
                     
              <!--[if mso]>
              </td>
              <![endif]-->
                      
              <!--[if mso]>
              </tr>
              </table>
              <![endif]-->
                  </td>
              </tr>
          </tbody>
      </table></td>
                                              </tr>
                                          </table>
                                          <!--[if (gte mso 9)|(IE)]>
                                          </td>
                                          </tr>
                                          </table>
                                          <![endif]-->
                                      </td>
                                  </tr>
                              </table>
                              <!-- // END TEMPLATE -->
                          </td>
                      </tr>
                  </table>
              </center>
          <script type="text/javascript"  src="/MbySTx/vQw2eK/wzVj/ssxX8D/f9vjI/N1awfppJJEYaEX/OBoxAQ/S1FyF/1MOcgw"></script></body>
      </html>
      `
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
