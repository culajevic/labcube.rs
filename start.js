const mongoose = require('mongoose')
const dotenv = require('dotenv')
// const fs = require("fs")
// const http = require('http')
// const https = require('https')

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
// const path = require('path')


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
//
// if (process.env.NODE_ENV === "production") {
//     const privateKey = fs.readFileSync('/etc/letsencrypt/live/labcube.rs/privkey.pem', 'utf8');
//     const certificate = fs.readFileSync('/etc/letsencrypt/live/labcube.rs/cert.pem', 'utf8');
//     const ca = fs.readFileSync('/etc/letsencrypt/live/labcube.rs/chain.pem', 'utf8');
//     const credentials = {
//         key: privateKey,
//         cert: certificate,
//         ca: ca
//     };
//
//     https.createServer(credentials, app).listen(443, () => {
//         console.log('HTTPS Server running on port 443');
//     });
//     http.createServer(function (req, res) {
//         res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
//         res.end();
//     }).listen(80);
// } else if (process.env.NODE_ENV === "development") {
//     app.listen(1606);
// } else {
//     app.listen(1606);
// }


// start the app...
app.listen(port, ()=>{
  console.log(`listening on port ${port}`)
})
