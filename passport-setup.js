const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const keys = require('./keys')
const User = require('./models/User')

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
    clientID:keys.google.clientID,
    clientSecret:keys.google.clientSecret
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
