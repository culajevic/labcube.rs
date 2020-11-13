const dotenv = require('dotenv')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const path = require('path')
// const keys = require('./keys')
const User = require('./models/User')

// use variables.env for sensitive data
dotenv.config({path:'variables.env'})


passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user)
  })
})

passport.use(
  new GoogleStrategy({
    callbackURL:'/google/redirect',
    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET
  }, (accessToken, refreshToken, profile, done) => {
    // check if user already exists in our database
    let find =  User.findOne({googleId:profile.id}).then((currentUser) => {
      if(currentUser) {
        console.log('user is' + currentUser)
        done(null, currentUser)
      } else {
        new User({
          username:profile.displayName,
          googleId:profile.id,
          email:profile._json.email,
          admin:0
        }).save().then((newUser) => {
          console.log('new user created' + newUser)
          done(null, newUser)
        })
      }
    })//find end
  })//google strategy end
)//passport end
