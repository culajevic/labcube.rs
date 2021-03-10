const mongoose = require('mongoose')
// mongoose.Promise = global.Promise
const slug = require('slugs')

const analysisSchema = new mongoose.Schema({

  analysisName:{
    type:String,
    required:'Obavezno je uneti ime analize',
    trim:true,
    isUnique:true
  },
  slug:String,
  abbr:[String],
  alt:[String],
  preview:{
    type:String,
    trim:true
  },
  shortDesc:{
    type:String
    // required:true
  },
  description:{
    type:String
    // required:true
  },
  preparation:{
    type:String
  },
  examination: {
    type:String,
    trim:true
  },
  low:{
    type:String
    // required:true
  },
  high:{
    type:String
    // required:true
  },
  notes:String,
  sample:String,
  availableHC:{
    type:Boolean,
    default:false
  },
  connectedTo:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Analysis'
    }],
    diseasesId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Disease'
    }],
    references:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Reference'
    }],
    groupId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Group'
    },
    writtenBy:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Editor',
      required:'obavezno je uneti autora teksta'
    },
  date:{
    type:Date,
    default:Date.now
  }
})

analysisSchema.pre('save', function(next) {
  newSlug = this.analysisName.split(" ").join('-')
  this.slug = newSlug
  next()
})

module.exports = mongoose.model('Analysis', analysisSchema)
