let passport = require('passport')

exports.signin = (req,res) => {
  res.render('signin')
}

exports.logout = (req, res) => {
  res.send('logout')
}

exports.google =  passport.authenticate('google',{scope:['openid', 'email', 'profile']})

exports.redirect = [passport.authenticate('google'),
(req,res) => {res.redirect('/profile/')}]

const authCheck = (req,res, next) => {
  if(!req.user) {
    res.redirect('/prijava')
  } else {
    next()
  }
}

exports.profile = [authCheck, (req,res) => {
  if(req.user.admin == 0) {
    res.send(`<a href=/logout>log out</a> ${req.user.username}`)
  } else {
    res.send('admin area')
  }
}]

exports.logout = (req,res) => {
  req.logout()
  res.redirect('/')
}
