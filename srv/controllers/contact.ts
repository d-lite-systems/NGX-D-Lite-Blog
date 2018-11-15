import * as dotenv from 'dotenv';
import * as nodemailer from 'nodemailer';
import * as path from 'path';

import Contact from '../models/contact';
import BaseCtrl from './base';

dotenv.load({ path: '.env' });
// Create a SMTP transporter object
let transporter = nodemailer.createTransport(
    {
        service: process.env.NODEMAILER_SERVICE,
        host: process.env.ACCOUNT_SMTP_HOST,
        port: Number(process.env.ACCOUNT_SMTP_PORT),
        secure: Boolean(process.env.ACCOUNT_SMTP_SECURE),
        auth: {
            user: process.env.ACCOUNT_USER,
            pass: process.env.ACCOUNT_PASS
        },
        logger: Boolean(process.env.TRANSPORTER_LOGGER),
        debug: Boolean(process.env.TRANSPORTER_LOGGER) // include SMTP traffic in the logs
    },
    {
        // default message fields
        // sender info
        from: process.env.NODEMAILER_FROM,
        headers: {
            'X-Laziness-level': 1000 // just an example header, no need to use this
        }
    }
);

export default class ContactCtrl extends BaseCtrl {
  model = Contact;

 	sendMail = (req, res) => {
 		const obj = new this.model(req.body);
    	obj.createdAt = new Date();
    	obj.save((err, item) => {
	      // 11000 is the code for duplicate key error
	      if (err && err.code === 11000) {
	        res.sendStatus(400);
	      }
	      if (err) {
	        return console.error(err);
	      }
	      res.status(200).json(item);
	    });
 	    // Message object
	    let message = {
	        // Comma separated list of recipients
	        to: process.env.ADMIN_EMAIL,
	        // Subject of the message
	        subject: obj.subject,
	        // plaintext body
	        text: obj.text
	    };
	    console.log(message)
	    transporter.sendMail(message, (error, info) => {
	        if (error) {
	            console.log('Error occurred');
	            console.log(error.message);
	            return process.exit(1);
	        }
	        console.log('Message sent successfully!');
	        console.log(nodemailer.getTestMessageUrl(info));
	        // only needed when using pooled connections
	        transporter.close();	        
	    });
		

 	}
}
