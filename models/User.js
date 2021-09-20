const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username:String,
  googleId:String,
  email:String,
  admin:Number,
  lab:Number,
  labId:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Lab'
    }],
  signupDate:Date,
  lastLoginDate:{
    type:Date,
    default:Date.now
  },
  password:String,
  image:String,
  aboutUser:String,
  privacy:Boolean,
  conditions:Boolean,
  birthYear:Number,
  gender:String,
  mobile:String,
  address:String,
  city:String,
  isVerified:Boolean,
  emailToken:String,
  height:Number,
  weight:Number,
  bmi:Number,
  smoking:String,
  alcohol:String,
  bloodPresure:String,
  nutrition:String,
  stress:String,
  hoursExcercise:Number,
  sweets:String,
  foodSuplements:String,
  therapy:String,
  therapyComment:String,
  currentStatus:String,
  currentStatusComment:String,
  anamnesis:String,
  anamnesisComment:String,
  menstruation:String,
  regularMenstruation:String,
  regularGinecologyChecks:String,
  pregnancy:String,
  deleted:Boolean,
  breastfeeding:String,
  resetLink:String,
  resetLinkExpires:Date
})

module.exports = mongoose.model('User', userSchema)
