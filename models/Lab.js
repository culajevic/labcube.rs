const mongoose = require('mongoose')
// mongoose.Promise = global.Promise
const validator = require('validator')
const slug = require('slugs')

// const Place = mongoose.model('Place')

const labSchema = new mongoose.Schema({
  labName:{
    type:String,
    required:'Unesite ime laboratorije'
  },
  slug:String,
  placeId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Place'
  },
  address:{
    type:String
    // required:'Unesi adresu laboratorije'
  },
  phone:[String],
  web:String,
  // email:{
  //   type:String,
  //   validate:[validator.isEmail,'enter correct email']
  // },
  email:String,
  vatNumber:Number,
  logo:String,
  priority:String,
  location:{
    type:{
      type:String,
      default:'Point'
    },
    coordinates:{
      type:[Number],
      required:'Unesite koordinate laboratorije'
    }
  },
  workingHours:{
    monday:{
      opens:String,
      closes:String
    },
    tuesday:{
      opens:String,
      closes:String,
    },
    wednesday:{
      opens:String,
      closes:String
    },
    thursday:{
      opens:String,
      closes:String
    },
    friday:{
      opens:String,
      closes:String
    },
    saturday:{
      opens:String,
      closes:String
    },
    sunday:{
      opens:String,
      closes:String
    }
  },
  open24h:{
    type:Boolean,
    default:false
  },
  accredited:{
    type:Boolean,
    default:false
  },
  private:{
    type:Boolean,
    default:false
  },
  patronage:{
    type:Boolean,
    default:false
  },
  disability:{
    type:Boolean,
    default:false
  },
  description:String,
  comment:String,
  date:{
    type:Date,
    default:Date.now()
  }
})

labSchema.pre('save', function(next) {
  newSlug = this.labName.split(" ").join('-')
  this.slug = newSlug
  next()
  // if(!this.isModified('labName')) {
  //   next()
  //   return
  // }
  // this.slug = slug(this.labName)
  // next()
})

module.exports = mongoose.model('Lab',labSchema)
