const dotenv = require('dotenv')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
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
  //options for google
  new GoogleStrategy({
    callbackURL:'/google/redirect',
    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET
  }, (accessToken, refreshToken, profile, done) => { //passport callback function
    // check if user already exists in our database
    let find =  User.findOne({googleId:profile.id}).then((currentUser) => {
      if(currentUser) {
        done(null, currentUser)
      } else {
        new User({
          username:profile.displayName,
          googleId:profile.id,
          email:profile._json.email,
          admin:0,
          signupDate:Date.now(),
          password:'',
          isVerified:true,
          emailToken:''
        }).save().then((newUser) => {
          console.log('new user created' + newUser)
          done(null, newUser)
        })
      }
    })//find end
  })//google strategy end
)//passport end


passport.use(
  new LocalStrategy({
    usernameField:'email'
  }, (email, password, done) => {
     User.findOne({email:email, isVerified:true})
      .then(user => {
        if(!user) {
          return done(null, false, {message:'email not registered'})
        }
        //match the pass
         bcrypt.compare(password, user.password, (err, isMatch) => {
           if(err) throw err
           if(isMatch) {
             return done(null, user)
           } else {
             return done(null, false, {message:'password incorrect'})
           }
         })
       })
         .catch(err => console.log('dada'))
      })
    )
