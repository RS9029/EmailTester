const express = require('express');
const nodeMailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const { timeStamp } = require('console');
const dotenv = require('dotenv').config();

const app = express();

let urlencodedParser = bodyParser.urlencoded({extended:false});
app.set('views')
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));

//Routes

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname + '/index.html'));
})

app.get('/sent', (req,res)=>{
    res.sendFile(path.join(__dirname + '/emailSent.html'));
})

    //Email

app.post('/',urlencodedParser,(req,res)=>{

    const emailTemplate = `
        <h1>You Have A New Email From ${req.body.name}</h1>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
            <li>Phone Number: ${req.body.phoneNumber}</li>
        </ul>
    `;

    let mailConfig = {
        from:`New Lead Tracker <test@rafaelsilvadev.me>`,
        to: 'rafaelsilva@northnerds.com',
        subject: 'New Lead Request',
        text: 'This is Text',
        html:emailTemplate
    };

    let transporter = nodeMailer.createTransport({
        name:"Email Test App",
        host:"mail.rafaelsilvadev.me",
        port:25,
        secure:false,
        auth:{
            user:"test@rafaelsilvadev.me",
            pass: '123456'
        },
        tls:{
            rejectUnauthorized:false
        }
    })

    transporter.sendMail(mailConfig, (error, info)=>{
        if(error){
            return(console.log(error));
        }
        console.log(`Message was sent: ${info.messageId}`);
    })
    
    res.redirect('/sent');
})

app.listen(process.env.PORT||5000, ()=>{
    console.log('server running..');
})