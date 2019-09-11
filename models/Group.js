const mongoose = require('mongoose')
// mongoose.Promise = global.Promise
const slug = require('slugs')

const groupSchema = new mongoose.Schema({
  name:{
    type:String,
    required:'Unesite ime grupe',
    trim:true
  },
  slug:String,
  frontPage:{
    type:Boolean,
    default:false
  },
  description:{
    type:String,
    trim:true,
    required:'Unesite opis za grupu analiza'
  },
  iconPath:{
    type:String,
    trim:true
  },
  lastUpdate:{
    type:Date,
    default:Date.now
  },
  priority:{
    type:Number,
    default:0
  }
})

groupSchema.pre('save', function(next) {
  newSlug = this.name.split(" ").join('-')
  this.slug = newSlug
  next()
  // if(!this.isModified('name')) {
  //   next()
  //   return
  // }
  // this.slug = slug(this.name)
  // next()
})

module.exports = mongoose.model('Group', groupSchema)
