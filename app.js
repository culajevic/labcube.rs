const bodyParser = require('body-parser')
// const cookieParser = require('cookie-parser')
const express = require('express')
const expressValidator = require('express-validator')
const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const helpers = require('./helpers')
const mongoose = require('mongoose')
const path = require('path')
const routes = require('./routes/index')
const session = require('express-session')
const dotenv = require('dotenv')
const keys = require('./keys')
const cookieSession = require('cookie-session')
const passport = require('passport')
const passportSetup = require('./passport-setup')


const app = express()

//  mandatory for using req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieSession({
  maxAge:24*60*60*1000,
  keys:[keys.session.sessionKey]
}))

//initialize passport
app.use(passport.initialize())
app.use(passport.session())


// handlebars middleware
app.engine('.hbs', exphbs({
  defaultLayout:'main',
  helpers:helpers,
  extname:'.hbs'
}))
app.set('view engine', '.hbs')

// app.use(cookieParser())

// express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))

app.use(flash())

// global variables
app.use(function(req,res,next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

app.use((req, res, next) => {
  res.locals.flashes = req.flash()
  next()
});

// public folder
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'src')))

//managing all routes
app.use('/', routes)

module.exports = app
