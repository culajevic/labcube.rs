const dotenv = require("dotenv");
const mongoose = require("mongoose");
const moment = require("moment");
const Analysis = mongoose.model("Analysis");
const Price = mongoose.model("Price");
const ObjectId = mongoose.Types.ObjectId;
const Result = mongoose.model("Result");
const Group = mongoose.model("Group");
const Email = mongoose.model("Email");
const Payment = mongoose.model("Payment");
const Discount = mongoose.model("Discount");
const multer = require("multer");
const mime = require("mime-types");
const nodemailer = require("nodemailer");
moment.locale("sr");

////////////////////////////////////////////////
const https = require("https"); //
const querystring = require("querystring"); //
const { runInNewContext } = require("vm");
////////////////////////////////////////////

dotenv.config({ path: "variables.env" });

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
  host: "mail.labcube.rs",
  port: 465,
  // secure:true,
  auth: {
    user: "labcube-tumacenje-no-reply@labcube.rs",
    pass: process.env.EMAILPASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  from: "labcube-tumacenje-no-reply@labcube.rs",
});

//upload results
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/results");
  },
  filename: function (req, file, cb) {
    const fileExtension = mime.extension(file.mimetype);
    cb(null, `${file.originalname}-${Date.now()}.${fileExtension}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
    fieldSize: 1024 * 512,
    fieldNameSize: 200,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(new multer.MulterError("dogodila se greška prilikom uploada"));
    }
  },
}).single("result");

exports.upload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      req.flash(
        "error_msg",
        "Dozvoljeni formati fajlova su pdf, jepg, jpg, png i veličina fajla mora biti manja od 5MB"
      );
      res.redirect("/tumacenje-laboratorijskih-analiza");
    } else {
      next();
    }
  });
};

exports.freeUpload = async (req, res) => {
  let newDate = new Date();
  let errors = [];
  let deadline = newDate.setDate(newDate.getDate() + 1);
  let invoiceDate = moment(new Date()).format("DD/MM/YYYY HH:mm");

  const groupNames = await Group.find({}, { name: 1, slug: 1, _id: 0 }).sort({
    name: 1,
  });
  const checkDiscount = await Discount.findOne({
    $and: [
      { discountId: req.body.kodPopust },
      { valid: true },
      { dueDate: { $gt: newDate } },
    ],
  });

  if (checkDiscount.discount == 100 && req.file) {
    //update ako je vaučer iskorišćen
    const updateVoucher = Discount.findOneAndUpdate(
      { discountId: req.body.kodPopust },
      { $set: { date: newDate } },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    ).exec();

    console.log(req.body)
    /////////////////////////////////

    let packageTime;

    switch (req.body.package) {
      case "490":
        packageTime = 24;
        break;
      case "590":
        packageTime = 12;
        break;
      case "890":
        packageTime = 4;
        break;
      case "623":
        packageTime = 4;
        break;
      default:
        packageTime = 24;
    }

    const uploadResult = new Result({
      userId: req.body.userId,
      email: req.body.email,
      status: "pending",
      result: req.file.filename,
      // package:req.body.package,
      package: packageTime,
      paid: 0,
      userComment: req.body.userComment,
      submitedDate: Date.now(),
      deadline: deadline,
    });
    let currentId = uploadResult._id;

    try {
      uploadResult.save();
      let mailOptions = {
        // from:req.body.email,
        from: "LabCube No-Reply<labcube-tumacenje-no-reply@labcube.rs>",
        // to: ["culajevic@labcube.rs", "culajevic@gmail.com"],
        
        bcc: [
          "tumacenje@labcube.rs",
          "culajevic@gmail.com",
          "jelenahajzler@gmail.com",
          "mandicvalentina@hotmail.com",
        "vanja.vlaisavljevic93@gmail.com",
        "djuric.miljana84@gmail.com"
        ],
        subject: `Novi rezultati za tumačenje ${req.body.kodPopust}`,
        text: "",
        html: `<!doctype html>
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
                        
                            <h2 style="text-align: center;"><span style="color:#1D88E5; font-size:22px;">Novi rezultati za tumačenje</span></h2>

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
                        
                            
                        </td>
                    </tr><br /><br />
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
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnButtonBlock" style="min-width:100%;">
    <tbody class="mcnButtonBlockOuter">
        <tr>
        <td style="padding-top:0; padding-right:18px; padding-bottom:18px; padding-left:18px;" valign="top" align="center" class="mcnButtonBlockInner">
                <table border="0" cellpadding="0" cellspacing="0" class="mcnButtonContentContainer" style="border-collapse: separate !important;border-radius: 9px;background-color: #5B8EE8;">
                    <tbody>
                        <tr>
                            <td align="center" valign="middle" class="mcnButtonContent" style="font-family: Arial; font-size: 18px; padding: 14px;">
                                <a class="mcnButton " title="" href="" target="_blank" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;">vreme za tumačenje: nije definisano </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
            <td style="padding-top:0; padding-right:18px; padding-bottom:18px; padding-left:18px;" valign="top" align="center" class="mcnButtonBlockInner">
                <table border="0" cellpadding="0" cellspacing="0" class="mcnButtonContentContainer" style="border-collapse: separate !important;border-radius: 9px;background-color: #FF6F6F;">
                    <tbody>
                        <tr>
                            <td align="center" valign="middle" class="mcnButtonContent" style="font-family: Arial; font-size: 18px; padding: 14px;">
                                <a class="mcnButton " title="" href="" target="_blank" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;">id: ${uploadResult._id}</a>
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
                <tbody>
                <tr>
                        <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:19px;">     
                        <h3 style="padding-top:22px;">Komentar pacijenta</h3><br />
                        <div style=""><span style="font-size:16px">${req.body.userComment}</span></div>
                        </td>                       
                    </tr>
               
                </tbody></table>
            </td>
        </tr>
    </tbody>
</table>
<table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;">
<tbody class="mcnDividerBlockOuter">
    <tr>
        <td class="mcnDividerBlockInner" style="min-width:100%; ">
            <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-top: 2px solid #EAEAEA;">
                <tbody><tr>
                    <td>
                        <span></span>
                    </td>
                </tr>
            </tbody></table>

        </td>
    </tr>
</tbody>
</table>

<table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
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
                        
                            <div style="text-align: center;"><span style="font-size:16px">Ukoliko imate bilo kakvih pitanja ili tehničkih problema prilikom tumačenja rezultata pozovite 0642612813 u bilo kom trenutku ili pošaljite mejl na zdravo@labcube.rs</span></div>

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
                        
                          <div style="text-align: center; margin-bottom:20px;"><span style="font-size:14px; line-heigth:16px;">Molimo vas da ne štampate rezultate pacijenta i ne prosleđujete ovaj mejl dalje. Hvala.</span></div>  
                          <div style="text-align: center;"><span style="font-size:14px; line-heigth:16px;">Ova mejl adresa se ne koristi za prijem mejlova, molimo vas da ne odgovarajte na ovaj mejl.</span></div>

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
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                    <tbody><tr>
                        
                        <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                        
                            
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
                        </table>
                        <!-- // END TEMPLATE -->
                    </td>
                </tr>
            </table>
        </center>
    <script type="text/javascript"  src="/F_7rRi1-VC1l/uq43LV/ZFiBT9/fa9zDww8iO5a1S/WRZ9AQ/KgYeQy/khPSQ"></script></body>
        </html> `,
        attachments: [
          {
            filename: req.file.filename,
            path: req.file.path,
          },
        ],
      };

      let mailOptionsCustomer = {
        from: "labcube-tumacenje-no-reply@labcube.rs",
        to: [req.body.email, "racuni@labcube.rs"],
        subject: "Tvoji rezultati su uspešno primljeni",
        text: "",
        html: `<!doctype html>
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
                    <title>*|MC:SUBJECT|*</title>
                    
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
                                    
                                    <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                                    
                                        <div style="text-align: center;"><span style="font-size:22px"><span style="color:#1D88E5"><strong>Rezultati su uspešno poslati na tumačenje</strong></span></span></div>
            
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
                                    
                                    <td valign="top" class="mcnTextContent" style="padding: 0px 18px 9px; line-height: 160%;">
                                        <div style="text-align: right;">
                                          id: ${currentId}<br>
                                          email: ${req.body.email}<br>
                                          vreme slanja: ${invoiceDate}<br>
                                
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
                                    
                                        <span style="font-size:16px">Primili smo tvoje rezultate. Dok čekaš tumačenje rezultata predlažemo ti da popuniš <a href="https://labcube.rs/profile" target="_blank">zdravstveni upitnik</a> ukoliko to već nije urađeno, to nam pomaže da bolje razumemo tvoje trenutno zdravstveno stanje i da tumačenje tvojih rezultata bude što tačnije.<br><br>
                                        Svi podaci koje podeliš sa nama se smatraju strogo poverljivim i koriste se isključivo u svrhu tumačenja rezultata. U svakom trenutku možeš obrisati sve podatke iz tvog zdravstvenog profila. Ukoliko te interesuje kako brinemo o tvojim podacima pročitaj našu <a href="https://labcube.rs/politika-privatnosti" target="_blank">politiku privatnosti</a></span>
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
                                    
                                    <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                                    
                                        <div style="text-align: left;"><span style="font-size:13px">*Ukoliko je iskorišćen kod za besplatno tumačenje, okvirno vreme za koje možeš očekivati naš komentar je 48h, ukoliko je tumačenje plaćeno putem uplatnice onda je maksimalno vreme tumačenja ono koje odgovara iznosu koji je uplaćen.</span></div>
            
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
                                    
                                        <div style="text-align: center;"><span style="font-size:12px"><a href="https://labcube.rs/politika-privatnosti" target="_blank">politika privatnosti</a>&nbsp;| <a href="https://labcube.rs/uslovi-koriscenja" target="_blank">uslovi korišćenja</a>&nbsp;| <a href="https://labcube.rs/uslovi-placanja" target="_blank">uslovi plaćanja</a>&nbsp;</span></div>
            
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
                            <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                                <tbody><tr>
                                    
                                    <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                                    
                                        
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
                                    </table>
                                    <!-- // END TEMPLATE -->
                                </td>
                            </tr>
                        </table>
                    </center>
                <script type="text/javascript"  src="/MbySTx/vQw2eK/wzVj/ssxX8D/f9vjI/N1awfppJJEYaEX/OBoxAQ/S1FyF/1MOcgw"></script></body>
            </html>
            `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log('greska prilikom slanja mejla labcubu', error);
        } else {
          console.log('uspeno poslat mejl labcubu', info.messageId);
        }
      });

      transporter.sendMail(mailOptionsCustomer, (error, info) => {
        if (error) {
          return console.log('nije otisao mejl customeru', error);
        } else {
          console.log('otisao mejl customeru', info.messageId);
        }
      });
      // req.flash('success_msg','Vaši rezultati su uspešno prosleđeni na tumačenje')
      // res.redirect('/')
    } catch (e) {
      req.flash(
        "error_msg",
        `Dogodila se greška prilikom slanja rezultata ${e}`
      );
      res.redirect("/tumacenje-laboratorijskih-analiza");
      console.log("nije uspesno upisano u bazu" + e);
    }
    res.render("paymentSuccess", {
      newDate: invoiceDate,
      shortId: currentId,
      amount: 0,
      packageTime,
      groupNames,
      user: req.user,
      title: "LabCube | Uspešno poslati rezultati",
    });
  } //checkdiscount == 100
  else {
    req.flash(
      "error_msg",
      "Odaberite fajl za tumačenje, fajl mora biti manji od 5MB"
    );
    res.redirect("/tumacenje-laboratorijskih-analiza");
  }
};

exports.payment = async (req, res) => {
  let newDateCheck = new Date();
  const groupNames = await Group.find({}, { name: 1, slug: 1, _id: 0 }).sort({
    name: 1,
  });
  let currentId;
  let resultUpload;
  let userComment = "";
  let errors = [];
  let formatPrice = parseInt(req.body.package);
  let discountId = req.body.kodPopust;
  let packageTime;

  switch (req.body.package) {
    case "490":
      packageTime = 24;
      break;
    case "590":
      packageTime = 12;
      break;
    case "890":
      packageTime = 4;
      break;
    default:
      packageTime = 24;
  }

  const checkDiscountCode = await Discount.findOne({
    $and: [
      { discountId: req.body.kodPopust },
      { valid: true },
      { dueDate: { $gt: newDateCheck } },
    ],
  });

  //ako neko pokusa da menja cenu //testirati da li radi bez ovoga?? 16.12.2023
  // if (
  //   formatPrice != 890 &&
  //   formatPrice != 590 &&
  //   formatPrice != 490 &&
  //   checkDiscountCode == null &&
  //   formatPrice != 1
  // ) {
  //   errors.push({ text: "Neispravan kôd, pokušaj ponovo." });
  // }

  //ako se menja osnovna cena 890 mora se promeniti i ovo ili ako se menja velicina popusta promeniti i nove cene, trenutno je popust 10% i 30%
  if (
    !(
      formatPrice == 890 ||
      formatPrice == 590 ||
      formatPrice == 490 ||
      formatPrice == 1
    )
  ) {
    errors.push({ text: "Došlo je do greške sa cenom, pokušajte ponovo" });
  }

  if (!req.body.package) {
    errors.push({
      text: "Obavezno je odabrati vreme za koje želiš da ti se protumači rezultat",
    });
  }

  if (!req.file) {
    errors.push({ text: "Nedostaju rezultati koje želiš da ti protumačimo" });
  }

  if (!req.body.consent) {
    errors.push({ text: "Potvrdi da se slažeš sa uslovima plaćanja" });
  }

  if (errors.length > 0) {
    res.render("labResultsAnalysis", {
      errors,
      package: req.body.package,
      email: req.body.email,
      user: req.user,
      title: "LabCube | Tumačenje laboratorijskih analiza",
      groupNames,
      komentar: req.body.userComment,
      consent: req.body.consent,
    });
    return false;
  } else {
    if (req.file) {
      let deadline = new Date();
      deadline.setHours(deadline.getHours() + parseInt(packageTime));
    } else {
      req.flash("error_msg", "doslo je do greske prilikom uploada");
    }
    //ako nesto ne radi otkomentarisati, nisam siguran cemu ovo  sluzi
    // resultUpload =  new Result(req.body)
    // currentId = resultUpload._id
    // console.log(currentId)
  }
  const request = async () => {
    const path = "/v1/checkouts";

    if (req.body.userComment.length == 0) {
      userComment = "nema komentara";
    } else if (req.body.userComment.length >= 254) {
      userComment = req.body.userComment.substring(0, 254);
    } else {
      userComment = req.body.userComment;
    }

    const data = querystring.stringify({
      entityId: process.env.ENTITYIDPRODUCTION,
      amount: req.body.package,
      "customer.email": req.body.email,
      currency: "RSD",
      "cart.items[0].description": userComment,
      "customer.merchantReference": req.body.kodPopust,
      "customer.merchantCustomerId": req.body.userId,
      "customParameters[SHOPPER_file]": req.file.filename,
      "customParameters[SHOPPER_path]": req.file.path,
      paymentType: "DB",
    });
    const options = {
      port: 443,
      host: process.env.PAYMENTHOSTPRODUCTION,
      path: path,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": data.length,
        Authorization: process.env.ACCESSTOKENPAYMENTPRODUCTION,
      },
    };
    return new Promise((resolve, reject) => {
      const postRequest = https.request(options, function (res) {
        const buf = [];
        res.on("data", (chunk) => {
          buf.push(Buffer.from(chunk));
        });
        res.on("end", () => {
          const jsonString = Buffer.concat(buf).toString("utf8");
          try {
            resolve(JSON.parse(jsonString));
          } catch (error) {
            reject(error);
          }
        });
      });
      postRequest.on("error", reject);
      postRequest.write(data);
      postRequest.end();
    });
  };
  request()
    .then((data) => {
      //uspesno kreiran checkout, posalji mejl
      console.log("payment data uspesno kreiran checkout", data);
      if (data.result.code == "000.200.100") {
        // recordId:currentId izbaceno iz res.render
        res.render("paymentPage", {
          data: data.id,
          userId: req.body.userId,
          email: req.body.email,
          resultFile: req.file.filename,
          package: req.body.package,
          user: req.user,
          groupNames,
          title: "Labcube | Potvrdite plaćanje usluge",
        });
      }
    })
    .catch((error) => {
      // res.redirect("labResultsAnalysis");
      console.log("greska prilikom prelaska sa payment page", error);
    });
    next()
};

exports.paymentDone = async (req, res) => {
  console.log("payment done section and resource path" + req.query.resourcePath)
  const requestCheckout = async () => {
    var path = req.query.resourcePath;
    path += "?entityId=" + process.env.ENTITYIDPRODUCTION;
    const options = {
      port: 443,
      host: process.env.PAYMENTHOSTPRODUCTION,
      path: path,
      method: "GET",
      headers: {
        Authorization: process.env.ACCESSTOKENPAYMENTPRODUCTION,
      },
    };
    return new Promise((resolve, reject) => {
      const postRequest = https.request(options, function (res) {
        const buf = [];
        res.on("data", (chunk) => {
          buf.push(Buffer.from(chunk));
        });
        res.on("end", () => {
          const jsonString = Buffer.concat(buf).toString("utf8");
          try {
            resolve(JSON.parse(jsonString));
          } catch (error) {
            reject(error);
          }
        });
      });
      postRequest.on("error", reject);
      postRequest.end();
    });
  };

  requestCheckout()
    .then((data) => {
      console.log('reached this payment confirmation section' + data.result)
      if (data.result.code == "000.000.000") {
        let newDate = moment(new Date()).format("DD/MM/YYYY HH:mm");
        let deadline = new Date();
        

        //ako se menja vreme promeniti deadline
        if (data.amount == 890) {
          deadline.setHours(deadline.getHours() + 4);
        }
        else if (data.amount == 590) {
          deadline.setHours(deadline.getHours() + 12);
        } else 
          deadline.setHours(deadline.getHours() + 24);
      

        const uploadResult = new Result({
          userId: data.customer.merchantCustomerId,
          email: data.customer.email,
          status: "pending",
          result: data.customParameters.SHOPPER_file,
          package: data.amount,
          paid: data.amount,
          ip: data.customer.ip,
          userComment: data.cart.items[0].description,
          submitedDate: Date.now(),
          deadline: deadline,
          paymentConsent: true,
        });

        let currentId = uploadResult._id;
        let shortId = String(currentId);
        shortId.substring(14, 2);

        let authCode = data.resultDetails.ConnectorTxID3;
        let authCodeParameter = authCode.substring(0, 6);

        const paymentLog = new Payment({
          ip: data.customer.ip,
          email: data.customer.email,
          amount: data.amount,
          cardHolder: data.card.holder,
          address: data.billing.street1,
          postalCode: data.billing.postcode,
          city: data.billing.city,
          paymentCode: data.result.code,
          paymentDesc: data.result.description,
          idSuccess: currentId,
          authCode: authCodeParameter,
        }).save();

        console.log('sacuvana uplata u bazi' + data.result)

        switch (data.amount) {
          case "490.00":
            packageTime = 24;
            break;
          case "590.00":
            packageTime = 12;
            break;
          case "890.00":
            packageTime = 4;
            break;
          case "623":
            packageTime = 4;
            break;
          default:
            packageTime = 24;
        }

        try {
          uploadResult.save();
          let mailOptions = {
            //  from:data.customer.email,
            from: "LabCube No-Reply <labcube-tumacenje-no-reply@labcube.rs>",
            // to: ["culajevic@gmail.com", "culajevic@labcube.rs"],
            //  bcc:['tumacenje@labcube.rs','culajevic@gmail.com'],
            // "jelenahajzler@gmail.com",
            // "mandicvalentina@hotmail.com",
            // "vanja.vlaisavljevic93@gmail.com",
            // "djuric.miljana84@gmail.com"    
            bcc: [
              "tumacenje@labcube.rs",
              "culajevic@gmail.com"
              
            ],
            subject: `Novi rezultati za tumačenje / ${packageTime}h / ${data.amount} RSD`,
            text: "",
            html: `
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
                   <title>Novi rezultati za tumačenje</title>
                   
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
                                   
                                       <h2 style="text-align: center;"><span style="color:#1D88E5; font-size:22px;">Novi rezultati za tumačenje</span></h2>
           
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
                                   
                                       
                                   </td>
                               </tr><br /><br />
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
           </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnButtonBlock" style="min-width:100%;">
               <tbody class="mcnButtonBlockOuter">
                   <tr>
                   <td style="padding-top:0; padding-right:18px; padding-bottom:18px; padding-left:18px;" valign="top" align="center" class="mcnButtonBlockInner">
                           <table border="0" cellpadding="0" cellspacing="0" class="mcnButtonContentContainer" style="border-collapse: separate !important;border-radius: 9px;background-color: #5B8EE8;">
                               <tbody>
                                   <tr>
                                       <td align="center" valign="middle" class="mcnButtonContent" style="font-family: Arial; font-size: 18px; padding: 14px;">
                                           <a class="mcnButton " title="" href="" target="_blank" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;">vreme za tumačenje: ${packageTime}h</a>
                                       </td>
                                   </tr>
                               </tbody>
                           </table>
                       </td>
                       <td style="padding-top:0; padding-right:18px; padding-bottom:18px; padding-left:18px;" valign="top" align="center" class="mcnButtonBlockInner">
                           <table border="0" cellpadding="0" cellspacing="0" class="mcnButtonContentContainer" style="border-collapse: separate !important;border-radius: 9px;background-color: #FF6F6F;">
                               <tbody>
                                   <tr>
                                       <td align="center" valign="middle" class="mcnButtonContent" style="font-family: Arial; font-size: 18px; padding: 14px;">
                                           <a class="mcnButton " title="" href="" target="_blank" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;">id: ${uploadResult._id}</a>
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
                           <tbody>
                           <tr>
                                   <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:19px;">     
                                   <h3 style="padding-top:22px;">Komentar pacijenta</h3><br />
                                   <div style=""><span style="font-size:16px">${data.cart.items[0].description}</span></div>
                                   </td>                       
                               </tr>
                          
                           </tbody></table>
                       </td>
                   </tr>
               </tbody>
           </table>
           <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;">
           <tbody class="mcnDividerBlockOuter">
               <tr>
                   <td class="mcnDividerBlockInner" style="min-width:100%; ">
                       <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-top: 2px solid #EAEAEA;">
                           <tbody><tr>
                               <td>
                                   <span></span>
                               </td>
                           </tr>
                       </tbody></table>
           
                   </td>
               </tr>
           </tbody>
           </table>
           
           <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
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
                                   
                                       <div style="text-align: center;"><span style="font-size:16px">Ukoliko imate bilo kakvih pitanja ili tehničkih problema prilikom tumačenja rezultata pozovite 0642612813 u bilo kom trenutku ili pošaljite mejl na zdravo@labcube.rs</span></div>
           
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
                                   
                                     <div style="text-align: center; margin-bottom:20px;"><span style="font-size:14px; line-heigth:16px;">Molimo vas da ne štampate rezultate pacijenta i ne prosleđujete ovaj mejl dalje. Hvala.</span></div>  
                                     <div style="text-align: center;"><span style="font-size:14px; line-heigth:16px;">Ova mejl adresa se ne koristi za prijem mejlova, molimo vas da ne odgovarajte na ovaj mejl.</span></div>
           
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
               <script type="text/javascript"  src="/F_7rRi1-VC1l/uq43LV/ZFiBT9/fa9zDww8iO5a1S/WRZ9AQ/KgYeQy/khPSQ"></script></body>
           </html>`,
            attachments: [
              {
                filename: data.customParameters.SHOPPER_file,
                path: data.customParameters.SHOPPER_path,
              },
            ],
          };

          // let userFirstName = req.user.username.split(' ')
          //mejl kojim se salje racun korisniku
          let mailOptionsCustomer = {
            from: "LabCube No-Reply<labcube-tumacenje-no-reply@labcube.rs>",
            to: [data.customer.email, "racuni@labcube.rs"],
            subject:
              "Uspešno izvršena uplata za tumačenje laboratorijskih rezultata",
            text: "",
            html: `<!doctype html>
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
                   <title>*|MC:SUBJECT|*</title>
                   
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
                 /*@editable*/background-position:50% 50%;
                 /*@editable*/background-size:cover;
                 /*@editable*/border-top:0;
                 /*@editable*/border-bottom:0;
                 /*@editable*/padding-top:25px;
                 /*@editable*/padding-bottom:25px;
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
                 /*@editable*/padding-top:0px;
                 /*@editable*/padding-bottom:0px;
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
                                   
                                   <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                                   
                                       <div style="text-align: center;"><span style="font-size:24px"><span style="color:#1D88E5"><strong>Uspešna transakcija</strong></span></span></div>
           
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
                                   
                                   <td valign="top" class="mcnTextContent" style="padding: 0px 18px 9px; line-height: 150%;">
                                   
                                       <div style="text-align: right;">broj transakcije: ${currentId}<br>
                          ${data.customer.email}<br>
                           ${data.card.holder}<br>
                           ${data.billing.street1}<br>
                           ${data.billing.city}</div>
           
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
                                   
                                   <td valign="top" class="mcnTextContent" style="padding: 0px 18px 9px; line-height: 200%;">
                                   
                                       <span style="font-size:18px"><strong>Detalji porudžbine</strong></span>
           
           <div style="text-align: left;"><span style="font-size:18px">⌛ Tumačenje u roku od ${packageTime}h*<br>
           📄 Autorizacioni kod banke ${authCodeParameter}<br>
           💳 ${data.paymentBrand} **** **** **** ${data.card.last4Digits}<br>
           💲 ${data.amount} RSD<br>
           ⏰ ${newDate}</span></div>
           
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
                                   
                                   <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                                   
                                       <span style="font-size:16px">Primili smo tvoje rezultate. Dok čekaš tumačenje rezultata predlažemo ti da popuniš <a href="https://labcube.rs/profile" target="_blank">zdravstveni profil</a> ukoliko to već nije urađeno, to nam pomaže da bolje razumemo tvoje trenutno zdravstveno stanje i da tumačenje tvojih rezultata bude što tačnije<br><br>
                                      Svi podaci koje podeliš sa nama se smatraju strogo poverljivim i koriste se isključivo u svrhu tumačenja rezultata. U svakom trenutku možeš obrisati sve podatke iz tvog zdravstvenog profila. Ukoliko te interesuje kako brinemo o tvojim podacima pročitaj našu&nbsp;&nbsp;<a href="https://labcube.rs/politika-privatnosti" target="_blank">politiku privatnosti</a></span>
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
                                   
                                   <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                                   
                                       <span style="font-size:14px">*maksimalno vreme za koje možeš dobiti tumačenje, moguće je dobiti tumačenje i pre ovog roka a sve u zavisnosti od broja zahteva na kojima trenutno radimo.</span>
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
                                   
                                       <div style="text-align: center;"><span style="font-size:12px"><a href="https://labcube.rs/politika-privatnosti" target="_blank">politika privatnosti</a>&nbsp;| <a href="https://labcube.rs/uslovi-koriscenja" target="_blank">uslovi korišćenja</a>&nbsp;| <a href="https://labcube.rs/uslovi-placanja" target="_blank">uslovi plaćanja</a>&nbsp;</span></div>
           
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
                                   
                                       <div style="text-align: center;"><span style="font-size:12px">Informacione tehnologije Nouvelle doo, 16. Oktobar 19, 11000 Beograd, PIB 106310784</span></div>
           
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
                                                       <td valign="top" class="footerContainer"></td>
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
               <script type="text/javascript"  src="/_oWIe/i/Yi/jl2S/fTNTPPeu/a9Ec6XQcDYpaOO/U2MDMBYB/Qj/07KmYGaTM"></script></body>
           </html>
           `,
          };

          //salje se mejl labcubu da postoje novi rezultati za tumacenje
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(
                "greska prilikom slanja potvrde o uspesnosti uplate",
                error
              );
            } else {
              console.log('saljemo mejl za novo tumacenje labcubu' + info.messageId);
            }
          });

          //salje se mejl customeru da je uspesno izvrsio uplatu
          transporter.sendMail(mailOptionsCustomer, (error, info) => {
            if (error) {
              return console.log(
                "greska prilikom slanja mejla customeru o uspesno izvrsenoj uplati",
                error
              );
            } else {
              console.log('Otisao mejl customeru' + info.messageId);
            }
          });
          // req.flash('success_msg','Vaši rezultati su uspešno prosleđeni na tumačenje')
          // res.redirect('/')
        } catch (e) {
          req.flash('error_msg', `Dogodila se greška prilikom slanja rezultata ${e}`)
          // res.redirect('/tumacenje-laboratorijskih-analiza')
          console.log("nije uspesno upisano u bazu" + e);
        }
        res.render("paymentSuccess", {
          data: data,
          newDate,
          amount: data.amount,
          packageTime,
          groupNames,
          authCodeParameter,
          shortId,
          user: req.user,
          title: "LabCube | Uspešno izvršena uplata",
        });
      } else {
        let secureError = /^(800\.400\.2|100\.380\.4|100\.390)/;
        let externalBankError = /^(800\.[17]00|800\.800\.[123])/;
        let riskSystemError =
          /^(100\.400\.[0-3]|100\.38|100\.370\.100|100\.370\.11)/;
        let blackListError = /^(100\.100\.701|800\.[32])/;
        let errorPayment;

        switch (true) {
          case externalBankError.test(data.result.code):
            errorPayment =
              "Banka je odbila transakciju, proverite da li imate dovoljno sredstava na kartici kao i da li Vaša kartica podržava plaćanje preko interneta.";
            break;
          case secureError.test(data.result.code):
            errorPayment =
              "Transakcija je odbijena zbog tehničke greške u 3D Secure sistemu.";
            break;
          case riskSystemError.test(data.result.code):
            errorPayment =
              "Banka nije u mogućnosti da autentifikuje korisnika, proverite da li ste ispravno uneli jednokratnu lozinku.";
            break;
          case blackListError.test(data.result.code):
            errorPayment =
              "Banka je odbila transakciju jer se kartica nalazi na crnoj listi.";
            break;
          default:
            errorPayment = data.result.description;
        }

        const paymentLog = new Payment({
          ip: data.customer.ip,
          email: data.customer.email,
          amount: 0,
          cardHolder: data.card.holder,
          address: data.billing.street1,
          postalCode: data.billing.postcode,
          city: data.billing.city,
          paymentCode: data.result.code,
          // paymentDesc:data.result.description
          paymentDesc: errorPayment,
        }).save();
        let mailOptionsCustomerError = {
          from: "labcube-tumacenje-no-reply@labcube.rs",
          to: [data.customer.email, "racuni@labcube.rs"],
          // to:'culajevic@gmail.com',
          subject: "Neuspešna transakcija",
          text: "",
          html: `

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
          attachments: [
            {
              filename: "headerBigEmail.png",
              path: "src/images/headerBigEmail.png",
              cid: "headerEmailBig",
            },
            {
              filename: "logoFooter.png",
              path: "src/images/logoFooter.png",
              cid: "logoFooter",
            },
          ],
        };

        transporter.sendMail(mailOptionsCustomerError, (error, info) => {
          if (error) {
            return console.log("uplata je odbijena", error);
          } else {
            console.log('customer payment is ok ' + info.messageId);
          }
        });

        req.flash("error_msg", "transakcija nije uspešno izvršena");
        res.render("paymentError", {
          data: data,
          amount: data.amount,
          errorPayment,
          groupNames,
          user: req.user,
          title: "LabCube | Greška prilikom plaćanja",
        });
      }
    })
    .catch(console.error);
    const groupNames = await Group.find({}, { name: 1, slug: 1, _id: 0 }).sort({name: 1});
};

exports.labResult = async (req, res) => {
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
};

exports.displayResults = async (req, res) => {
  const groupNames = await Group.find({}, { name: 1, slug: 1, _id: 0 }).sort({
    name: 1,
  });
  res.render("results", {
    sidebarNav: false,
    groupNames,
    user: req.user,
    title: "Labcube | Pretraga",
  });
};

exports.displayAnalysisDetails = async (req, res) => {
  let analysisDetails = await Analysis.findOne({ slug: req.params.slug })
    .populate("connectedTo", "analysisName abbr slug")
    .populate("references")
    .populate("writtenBy")
    .populate("groupId", "iconPath slug name");

  const groupNames = await Group.find({}, { name: 1, slug: 1, _id: 0 }).sort({
    name: 1,
  });
  // let title = analysisDetails.analysisName

  const prices = await Price.aggregate([
    { $unwind: "$cenovnik" },
    { $match: { "cenovnik.analiza": ObjectId(analysisDetails._id) } },
    {
      $group: {
        _id: "$cenovnik.analiza",
        minPrice: { $min: "$cenovnik.cena" },
        maxPrice: { $max: "$cenovnik.cena" },
      },
    },
    { $project: { minPrice: 1, maxPrice: 1 } },
  ]);
  res.render("details", {
    analysisDetails,
    prices,
    sidebarNav: true,
    user: req.user,
    groupNames,
    title: `Analiza | ${analysisDetails.analysisName}`,
    metaDescription: analysisDetails.preview,
    metaKeywords: analysisDetails.alt,
  });
};

exports.labRestultsAnalysis = async (req, res) => {
  let groupNames = await Group.find({}, { name: 1, slug: 1, _id: 0 }).sort({
    name: 1,
  });
  res.render("labResultsAnalysis", {
    user: req.user,
    groupNames,
    title: "LabCube | Tumačenje laboratorijskih analiza",
    metaDescription:
      "Ukoliko ste dobili rezultate laboratorije a ne razumete značenje nekih parametara mi Vam možemo pomoći. Napravite nalog, uradite upload rezultata i u roku od 24h sve će biti jasnije.",
    metaKeywords:
      "Tumačenje rezultata laboratorijskih analiza, šta znače povišene vrednosti laboratorijskih analiza, tumačenje rezultata krvne slike, Povišen CRP, Povišeni leukociti, Pregled krvne slike, Kako tumačiti rezultate krvne slike, Povišeni monociti, tumačenje krvne slike ",
  });
};

exports.sendFeedbackLabCube = async (req, res) => {
  let newDate = Date();
  let interpretationFeedback = await Result.findOneAndUpdate(
    { _id: req.params.id },
    {
      userFeedback: req.body.interpretationFeedback,
      star: req.body.star,
      feedbackDate: newDate,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  ).exec();
  req.flash("success_msg", "Komentar uspešno poslat. Hvala");
  res.redirect("/myResult/" + req.params.id);
};

exports.subscribe = async (req, res) => {
  let takeUserEmail = new Email(req.body);
  let currentPage = req.get("referer");
  let myList = currentPage.split("/");
  myList.splice(0, 3);
  let newLink = myList.join("/");
  console.log(newLink);

  // console.log(currentPage)

  try {
    await takeUserEmail.save();
    req.flash("success_msg", "Uspešno ste upisali email, hvala.");
    res.redirect(newLink);
  } catch (e) {
    req.flash("error_msg", `Dogodila se greška ${e} prilikom upisa mejla`);
  }
};
