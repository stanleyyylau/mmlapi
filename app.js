// Set up environment variables and DB connection

var setUp = require('./config/setup')();

const express = require('express');
const bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

var https = require("https");
setInterval(function() {
    https.get("https://mmlapi.herokuapp.com/");
}, 300000); // every 5 minutes (300000)

const app = express();
const port = process.env.PORT;
var Leads = require('./models/Leads');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

const requestIp = require('request-ip');

var clientIp;

// inside middleware handler 
const ipMiddleware = function(req, res, next) {
    clientIp = requestIp.getClientIp(req); 
    next();
};

app.use(ipMiddleware)


var mailInfo = {
	host: "smtp.gmail.com",
	domains: ["gmail.com", "googlemail.com"],
	port: 465,
	userAcount: process.env.GMAILUSERNAME,
	userPassword: process.env.GMAILPASSWORD
}

app.get('/', function(req, res) {
    res.send('hello, there')
})

app.post('/leads', function(req, res) {
    var {website, page, ip, details} = req.body;
    var newLead = new Leads({
        website,
        page,
        ip,
        details
    })

    newLead.save().then((result)=>{
        console.log(result)
    }).catch(err => console.log(err))

  var transporter = nodemailer.createTransport({
        host: mailInfo.host,      //mail service mail host
        domains: mailInfo.domains,
        secureConnection:true,      //secureConnection 使用安全连接
        port: mailInfo.port,                   //port STMP端口号
        auth:{
          user: mailInfo.userAcount, //Email address
          pass: mailInfo.userPassword //Email pw
       },
       debug: true
  });
  
  var contentFromUser = {
        website,
        page,
        ip: clientIp,
        details
      }
  var text = JSON.stringify(contentFromUser, null, 2) || JSON.stringify(contentFromUser, null, 2);
  console.log("the message is " + text);
  var mailOptions = {
      from: 'stanleyyylauserver@gmail.com', // sender address
      to: 'stanleyyylau@gmail.com', // list of receivers
      subject: 'U just receive a message from your fortfolio website...', // Subject line
      text: text //, // plaintext body
      // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
  };
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          console.log(error);
          res.json({yo: 'error'});
      }else{
          console.log('Message sent: ' + info.response);
          res.json({yo: info.response, status: 200});
      };
  });

})

// Error handling at the end
app.use((req, res) => {
res.status(404).send('We can\' find what you\'re looking for');
})

app.use((err, req, res, next) => {
  console.error('got error')
  console.log(err)
  res.status(500).send('Something broke!')
})

app.listen(port, function () {
  console.log(`MML API listening on port ${port}!`)
})

// Export App for testing and server up
module.exports = app;

