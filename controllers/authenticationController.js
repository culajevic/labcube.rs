exports.signin = (req,res) => {
  res.render('signin')
}

exports.logout = (req, res) => {
  res.send('logout')
}

exports.google = (req,res) => {
  res.send('handle with google')
}
