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


const app = require('./app')

// set a PORT
const port = process.env.PORT || 1606

// use variables.env for sensitive data
dotenv.config({path:'variables.env'})

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
