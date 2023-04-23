import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import nodemailer from "nodemailer";
import pdf from "html-pdf";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import errorHandler from "./middleware/errorMiddleware.js";

import userRoute from "./routes/userRoute.js";
import profileRoute from "./routes/profileRoute.js";
import clientRoute from "./routes/clientRoute.js";
import invoiceRoute from "./routes/invoiceRoute.js";

import pdfTemplate from "./documents/index.js";
import emailTemplate from "./documents/email.js";


const app = express();
dotenv.config();

//MIDDLEWARE

app.use(
	cors({
		origin: process.env.CLIENT_URL,
		methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
		credentials: true,
		exposedHeaders: ["*", "Authorization"],
	})
);

app.use(express.json({ limit: "30mb", extended: true}));
app.use(cookieParser());
app.use(express.urlencoded({ limit: "30mb", extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../client/dist")))

//ROUTES MIDDLEWARE
app.use("/api/users",userRoute);
app.use("/api/profiles",profileRoute);
app.use("/api/clients",clientRoute);
app.use("/api/invoices",invoiceRoute);

//NODEMAILER TRANSPORT FOR SENDING INVOICE VIA EMAIL
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port : process.env.SMTP_PORT,
    auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
    },
    tls:{
        rejectUnauthorized:false
    }
})

var options = { format: 'A4' };

//SEND PDF INVOICE VIA EMAIL
app.post('/api/send-pdf',(req,res) => {
    const { email, company } = req.body;
    pdf.create(pdfTemplate(req.body), options).toFile('invoice.pdf', (err) => {
        //send mail with defined transport object
        transporter.sendMail({
            from:`Accountill ${process.env.SMTP_USER}`, // sender address
            to: `${email}`, // list of receivers
            replyTo: `${company.email}`, 
            subject: `Invoice from ${company.businessName ? company.businessName : company.name }`, // subject line
            text: `Invoice from ${company.businessName ? company.businessName : company.name }`, // plain text body
            html: emailTemplate(req.body), // html body
            attachments: [{
                filename: 'invoice.pdf',
                path: `${__dirname}/invoice.pdf`,
                contentType: 'application/pdf'
            }]
        });

        if(err){
            res.send(Promise.reject());
        }
        res.send(Promise.resolve());
    });
});

//CREATE AND SEND PDF INVOICE
app.post('/api/create-pdf',(req,res) => {
    pdf.create(pdfTemplate(req.body), options).toFile('invoice.pdf', (err) => {
        if(err){
            res.send(Promise.reject());
        }
        res.send(Promise.resolve());
    })
})

//SEND PDF INVOICE
app.get('/api/fetch-pdf', (req, res) => {
    res.sendFile(`${__dirname}/invoice.pdf`)
})


//ROUTES
app.get("/api",(req,res) => {
    res.send("<h1>Home Page...</h1>");
})

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"))
})

//ERROR MIDDLEWARE
app.use(errorHandler);

//MONGODB CONNECTION
mongoose.set('strictQuery', true);
const MONGO_URL = process.env.MONGO_URL;
mongoose.connect(MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(() => {
    console.log('CONNECTION SUCCESSFULL...:)');
}).catch((err)=>{
    console.log(err.message,"<-- Error From DB Connection");
})


const PORT = process.env.PORT || 4000;
app.listen(PORT,() => {
    console.log(`Server Running on port ${PORT}`);
})

