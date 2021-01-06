const mongoose = require('mongoose')
const dotenv = require('dotenv')

// import models
require('./models/Group')
require('./models/Place')
require('./models/Lab')
require('./models/Editor')
require('./models/Reference')
require('./models/Disease')
require('./models/Analysis')
require('./models/Faq')
require('./models/Prices')
require('./models/Result')
require('./models/User')
require('./models/Schedule')
require('./models/Feedback')



const app = require('./app')

// use variables.env for sensitive data
dotenv.config({path:'variables.env'})

// set a PORT
const port = process.env.PORT || 1606

// connect to database
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true } )
mongoose.Promise = global.Promise
mongoose.connection.on('error', (err) => {
  console.log(`there is an error ${err}`)
})

// start the app...
app.listen(port, ()=>{
  console.log(`listening on port ${port}`)
})
